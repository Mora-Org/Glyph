/**
 * ffmpegBuilder.ts
 * Constrói os argumentos do comando FFmpeg a partir do resultado do frameExporter.
 * Mixagem de vídeo e áudio multi-trilha.
 */

import type { ProjectExportResult, SceneExportResult } from './frameExporter';
import type { SceneElement, AudioTrack, AudioElement } from '@/store/projectStore';
import { EXPORT_FPS } from './frameExporter';

export interface FFmpegBuildResult {
  args: string[];
  framesDir: string;
  outputPath: string;
}

export interface BuildOptions {
  framesDir:  string;
  outputPath: string;
  encoder:    'h264_nvenc' | 'h264_amf' | 'h264_qsv' | 'libx264';
}

/**
 * Constrói os argumentos FFmpeg para o projeto completo com Áudio.
 */
export function buildFFmpegArgs(
  exportResult: ProjectExportResult,
  options:      BuildOptions
): FFmpegBuildResult {
  const { framesDir, outputPath, encoder } = options;
  const args: string[] = [];
  const inputManager   = new InputManager();

  // ── Input 0: sequência de frames PNG ─────────────────────────────────────
  args.push('-framerate', String(EXPORT_FPS));
  args.push('-i', `${framesDir}/frame_%06d.png`);

  // ── Inputs de Overlay (Vídeo/GIF) ────────────────────────────────────────
  const overlayInputs = collectOverlayInputs(exportResult.scenes);
  for (const asset of overlayInputs) {
    if (!inputManager.has(asset.src!)) {
      inputManager.add(asset.src!);
      args.push('-i', asset.src!);
    }
  }

  // ── Inputs de Áudio ──────────────────────────────────────────────────────
  const audioInputs = collectAudioInputs(exportResult.audioTracks);
  for (const src of audioInputs) {
    if (!inputManager.has(src)) {
      inputManager.add(src);
      args.push('-i', src);
    }
  }

  // ── filter_complex ────────────────────────────────────────────────────────
  const videoGraph = buildVideoFilterGraph(exportResult.scenes, inputManager);
  const audioGraph = buildAudioFilterGraph(exportResult.audioTracks, inputManager);

  const filters: string[] = [...videoGraph.filters, ...audioGraph.filters];
  
  if (filters.length > 0) {
    args.push('-filter_complex', filters.join('; '));
  }

  // ── Mapping ───────────────────────────────────────────────────────────────
  args.push('-map', videoGraph.finalOutput);
  if (audioGraph.finalOutput) {
    args.push('-map', audioGraph.finalOutput);
  }

  // ── Video Encoder ─────────────────────────────────────────────────────────
  args.push('-c:v', encoder);
  args.push(...encoderPreset(encoder));
  args.push('-pix_fmt', 'yuv420p');

  // ── Audio Encoder ─────────────────────────────────────────────────────────
  if (audioGraph.finalOutput) {
    args.push('-c:a', 'aac', '-b:a', '192k');
  }

  args.push('-y', outputPath);

  return { args, framesDir, outputPath };
}

// ── Helpers de Input ─────────────────────────────────────────────────────────

class InputManager {
  private map = new Map<string, number>();
  private next = 1;
  has(src: string) { return this.map.has(src); }
  add(src: string) { this.map.set(src, this.next++); }
  idx(src: string) { return this.map.get(src)!; }
}

function collectOverlayInputs(scenes: SceneExportResult[]): SceneElement[] {
  const seen = new Set<string>();
  const out:  SceneElement[] = [];
  for (const scene of scenes) {
    for (const el of scene.overlayAssets) {
      if (el.src && !seen.has(el.src)) {
        seen.add(el.src);
        out.push(el);
      }
    }
  }
  return out;
}

function collectAudioInputs(tracks: AudioTrack[]): string[] {
  const seen = new Set<string>();
  const out:  string[] = [];
  for (const track of tracks) {
    for (const el of track.elements) {
      if (!seen.has(el.src)) {
        seen.add(el.src);
        out.push(el.src);
      }
    }
  }
  return out;
}

// ── Graph de Vídeo ───────────────────────────────────────────────────────────

function buildVideoFilterGraph(
  scenes:       SceneExportResult[],
  inputManager: InputManager
): { filters: string[]; finalOutput: string } {
  const filters: string[] = [];
  let   current           = '[0:v]';
  let   outIdx            = 0;

  for (const scene of scenes) {
    for (const el of scene.overlayAssets) {
      if (!el.src || !inputManager.has(el.src)) continue;
      const inputIdx   = inputManager.idx(el.src);
      const scaledTag  = `[vsc${outIdx}]`;
      const outputTag  = `[vout${outIdx}]`;
      const globalStart = scene.startFrame / EXPORT_FPS + el.startTime;
      const globalEnd   = scene.startFrame / EXPORT_FPS + el.endTime;

      const w = Math.round(el.transform.width  * el.transform.scaleX);
      const h = Math.round(el.transform.height * el.transform.scaleY);
      
      filters.push(`[${inputIdx}:v]scale=${w}:${h}${scaledTag}`);
      const enable = `enable='between(t,${globalStart.toFixed(3)},${globalEnd.toFixed(3)})'`;
      filters.push(`${current}${scaledTag}overlay=${Math.round(el.transform.x)}:${Math.round(el.transform.y)}:${enable}${outputTag}`);

      current = outputTag;
      outIdx++;
    }
  }

  return { filters, finalOutput: outIdx === 0 ? '0:v' : `vout${outIdx - 1}` };
}

// ── Graph de Áudio ───────────────────────────────────────────────────────────

function buildAudioFilterGraph(
  tracks:       AudioTrack[],
  inputManager: InputManager
): { filters: string[]; finalOutput: string | null } {
  const filters: string[] = [];
  const audioOutputs: string[] = [];
  let   elIdx = 0;

  for (const track of tracks) {
    for (const el of track.elements) {
      const inputIdx = inputManager.idx(el.src);
      const outputTag = `[aout${elIdx}]`;
      
      // Filtros: Trim (trimagem) -> Delay (posição global) -> Volume -> Noise Reduction
      let chain = `[${inputIdx}:a]atrim=start=${el.offset}:duration=${el.duration},asetpts=PTS-STARTPTS`;
      
      // Delay em milissegundos
      const delayMs = Math.round(el.startTime * 1000);
      chain += `,adelay=${delayMs}|${delayMs}`;
      
      if (el.volume !== 1) {
        chain += `,volume=${el.volume.toFixed(2)}`;
      }
      
      if (el.noiseReduction) {
        // afftdn: FFT denoiser (mais leve e eficaz para ruído de fundo)
        chain += `,afftdn`;
      }

      filters.push(`${chain}${outputTag}`);
      audioOutputs.push(outputTag);
      elIdx++;
    }
  }

  if (audioOutputs.length === 0) return { filters: [], finalOutput: null };

  // Mixagem final
  const mixTag = '[amix_out]';
  const amix = `${audioOutputs.join('')}amix=inputs=${audioOutputs.length}:normalize=1${mixTag}`;
  filters.push(amix);

  return { filters, finalOutput: 'amix_out' };
}

function encoderPreset(encoder: BuildOptions['encoder']): string[] {
  switch (encoder) {
    case 'h264_nvenc': return ['-preset', 'p4', '-rc', 'vbr', '-cq', '23'];
    case 'h264_amf':   return ['-quality', 'balanced'];
    case 'h264_qsv':   return ['-preset', 'medium'];
    case 'libx264':    return ['-preset', 'medium', '-crf', '23'];
  }
}
