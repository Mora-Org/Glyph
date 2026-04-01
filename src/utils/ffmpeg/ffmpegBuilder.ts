/**
 * ffmpegBuilder.ts
 * Constrói os argumentos do comando FFmpeg a partir do resultado do frameExporter.
 * A sequência de PNGs é o input base; vídeos e GIFs são sobrepostos via filter_complex.
 *
 * Saída esperada (exemplo):
 *   ffmpeg
 *     -framerate 30 -i /tmp/peg/frames_%06d.png   <- input base (frames)
 *     -i /path/to/video.mp4                        <- overlay assets
 *     -filter_complex "
 *       [1:v]scale=400:300[ov1];
 *       [0:v][ov1]overlay=100:50:enable='between(t,1,4)'[out]
 *     "
 *     -map "[out]"
 *     -c:v h264_nvenc -preset p4 -pix_fmt yuv420p
 *     -y /path/to/output.mp4
 */

import type { ProjectExportResult, SceneExportResult } from './frameExporter';
import type { SceneElement } from '@/store/projectStore';
import { EXPORT_FPS } from './frameExporter';

export interface FFmpegBuildResult {
  /** Argumentos prontos para passar ao comando Rust. */
  args: string[];
  /** Caminho da pasta temporária onde os frames devem ser escritos. */
  framesDir: string;
  /** Caminho do arquivo de saída. */
  outputPath: string;
}

export interface BuildOptions {
  /** Pasta temporária para os frames PNG (gerenciada pelo Rust via Tauri FS). */
  framesDir:  string;
  /** Caminho completo do arquivo de saída. */
  outputPath: string;
  /** Encoder de vídeo selecionado (decidido pelo gpu.rs). */
  encoder:    'h264_nvenc' | 'h264_amf' | 'h264_qsv' | 'libx264';
}

/**
 * Constrói os argumentos FFmpeg para o projeto completo.
 */
export function buildFFmpegArgs(
  exportResult: ProjectExportResult,
  options: BuildOptions
): FFmpegBuildResult {
  const { framesDir, outputPath, encoder } = options;
  const args: string[] = [];

  // ── Input 0: sequência de frames PNG ─────────────────────────────────────
  args.push('-framerate', String(EXPORT_FPS));
  args.push('-i', `${framesDir}/frame_%06d.png`);

  // ── Inputs 1..N: assets de overlay (vídeo/gif) ───────────────────────────
  const overlayInputs = collectOverlayInputs(exportResult.scenes);
  const inputManager  = new InputManager();

  for (const asset of overlayInputs) {
    if (!inputManager.has(asset.src!)) {
      inputManager.add(asset.src!);
      args.push('-i', asset.src!);
    }
  }

  // ── filter_complex ────────────────────────────────────────────────────────
  const filterGraph = buildFilterGraph(exportResult.scenes, inputManager);

  if (filterGraph.filters.length > 0) {
    args.push('-filter_complex', filterGraph.filters.join('; '));
    args.push('-map', filterGraph.finalOutput);
  } else {
    // Sem overlays — usa o stream base direto
    args.push('-map', '0:v');
  }

  // ── Encoder e opções de codec ─────────────────────────────────────────────
  args.push('-c:v', encoder);
  args.push(...encoderPreset(encoder));
  args.push('-pix_fmt', 'yuv420p');

  // ── Output ────────────────────────────────────────────────────────────────
  args.push('-y', outputPath);

  return { args, framesDir, outputPath };
}

// ── InputManager: garante que o mesmo arquivo não seja adicionado 2x ─────────

class InputManager {
  private map = new Map<string, number>(); // src → input index (base 1)
  private next = 1;

  has(src: string)  { return this.map.has(src); }
  add(src: string)  { this.map.set(src, this.next++); }
  idx(src: string)  { return this.map.get(src)!; }
  entries()         { return [...this.map.entries()]; }
}

// ── Coleta todos os assets de overlay únicos ──────────────────────────────────

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

// ── Constrói o filter_complex com overlays posicionados no tempo ──────────────

function buildFilterGraph(
  scenes:       SceneExportResult[],
  inputManager: InputManager
): { filters: string[]; finalOutput: string } {
  const filters: string[] = [];
  let   current           = '[0:v]'; // stream de entrada atual
  let   outIdx            = 0;

  for (const scene of scenes) {
    for (const el of scene.overlayAssets) {
      if (!el.src || !inputManager.has(el.src)) continue;

      const inputIdx   = inputManager.idx(el.src);
      const scaledTag  = `[sc${outIdx}]`;
      const outputTag  = `[v${outIdx}]`;

      // Tempo global do elemento (offset da cena + startTime do elemento)
      const globalStart = scene.startFrame / EXPORT_FPS + el.startTime;
      const globalEnd   = scene.startFrame / EXPORT_FPS + el.endTime;

      const w = Math.round(el.transform.width  * el.transform.scaleX);
      const h = Math.round(el.transform.height * el.transform.scaleY);
      const x = Math.round(el.transform.x);
      const y = Math.round(el.transform.y);

      // Scale do asset para o tamanho definido pelo usuário
      filters.push(`[${inputIdx}:v]scale=${w}:${h}${scaledTag}`);

      // Overlay com janela de tempo
      const enable = `enable='between(t,${globalStart.toFixed(3)},${globalEnd.toFixed(3)})'`;
      filters.push(`${current}${scaledTag}overlay=${x}:${y}:${enable}${outputTag}`);

      current = outputTag;
      outIdx++;
    }
  }

  return {
    filters,
    finalOutput: outIdx === 0 ? '[0:v]' : `[v${outIdx - 1}]`,
  };
}

// ── Presets por encoder ───────────────────────────────────────────────────────

function encoderPreset(encoder: BuildOptions['encoder']): string[] {
  switch (encoder) {
    case 'h264_nvenc': return ['-preset', 'p4', '-rc', 'vbr', '-cq', '23'];
    case 'h264_amf':   return ['-quality', 'balanced'];
    case 'h264_qsv':   return ['-preset', 'medium'];
    case 'libx264':    return ['-preset', 'medium', '-crf', '23'];
  }
}
