/**
 * frameExporter.ts
 * Renderiza cada cena do projeto frame a frame num canvas Fabric offscreen,
 * exportando como PNG base64. Vídeos e GIFs são pulados — o FFmpeg os
 * sobrepõe como inputs separados via filter_complex.
 */

import type { Scene, SceneElement, AudioTrack } from '@/store/projectStore';

export const EXPORT_FPS    = 30;
export const EXPORT_WIDTH  = 1280;
export const EXPORT_HEIGHT = 720;

/** Um frame renderizado de uma cena. */
export interface RenderedFrame {
  /** Índice global do frame (contínuo entre cenas). */
  index: number;
  /** PNG como data URL (base64). */
  dataUrl: string;
}

/** Resultado da exportação de uma cena. */
export interface SceneExportResult {
  sceneId:       string;
  frames:        RenderedFrame[];
  /** Elementos de vídeo/gif que o FFmpeg deve sobrepor. */
  overlayAssets: SceneElement[];
  /** Duração total da cena em segundos. */
  duration:      number;
  /** Frame de início desta cena no timeline global. */
  startFrame:    number;
}

/** Resultado completo do projeto. */
export interface ProjectExportResult {
  scenes:        SceneExportResult[];
  audioTracks:   AudioTrack[];
  totalFrames:   number;
  totalDuration: number;
}

/**
 * Exporta todas as cenas do projeto como sequências de frames PNG.
 * @param scenes Lista de cenas do projeto (apenas Scene, sem ActivePause).
 * @param onProgress Callback com progresso (0–1).
 */
export async function exportProjectFrames(
  scenes: Scene[],
  audioTracks: AudioTrack[],
  onProgress?: (ratio: number) => void
): Promise<ProjectExportResult> {
  const { Canvas: FabricCanvas, FabricImage, IText } = await import('fabric');

  // Canvas offscreen — não montado no DOM
  const offscreenEl = document.createElement('canvas');
  offscreenEl.width  = EXPORT_WIDTH;
  offscreenEl.height = EXPORT_HEIGHT;

  const fabric = new FabricCanvas(offscreenEl, {
    width:                EXPORT_WIDTH,
    height:               EXPORT_HEIGHT,
    backgroundColor:      '#000000',
    preserveObjectStacking: true,
    renderOnAddRemove:    false,
  });

  const results:       SceneExportResult[] = [];
  let   globalFrame    = 0;
  const totalFrames    = scenes.reduce((acc, s) => acc + Math.ceil(s.duration * EXPORT_FPS), 0);
  let   framesRendered = 0;

  for (const scene of scenes) {
    const sceneFrames    = Math.ceil(scene.duration * EXPORT_FPS);
    const startFrame     = globalFrame;
    const frames:        RenderedFrame[] = [];
    const overlayAssets: SceneElement[]  = [];

    // Separa assets de overlay (vídeo/gif) dos renderizáveis no canvas
    const renderableEls = scene.elements.filter((el) => {
      if (el.type === 'video' || el.type === 'gif') {
        overlayAssets.push(el);
        return false;
      }
      return true;
    });

    for (let f = 0; f < sceneFrames; f++) {
      const t = f / EXPORT_FPS; // tempo em segundos dentro da cena

      // Filtra elementos visíveis neste instante
      const visibleEls = renderableEls.filter(
        (el) => t >= el.startTime && t < el.endTime
      );

      fabric.clear();
      fabric.backgroundColor = '#000000';

      // Adiciona elementos ao canvas offscreen
      for (const el of visibleEls) {
        await renderElement(fabric, FabricImage, IText, el, t);
      }

      fabric.renderAll();

      frames.push({
        index:   globalFrame,
        dataUrl: offscreenEl.toDataURL('image/png'),
      });

      globalFrame++;
      framesRendered++;
      onProgress?.(framesRendered / totalFrames);
    }

    results.push({
      sceneId:      scene.id,
      frames,
      overlayAssets,
      duration:     scene.duration,
      startFrame,
    });
  }

  fabric.dispose();

  return {
    scenes:        results,
    audioTracks,
    totalFrames,
    totalDuration: scenes.reduce((acc, s) => acc + s.duration, 0),
  };
}

// ── Renderiza um elemento no canvas Fabric offscreen ─────────────────────────

async function renderElement(
  fabric:       InstanceType<Awaited<ReturnType<typeof import('fabric')>>['Canvas']>,
  FabricImage:  Awaited<ReturnType<typeof import('fabric')>>['FabricImage'],
  IText:        Awaited<ReturnType<typeof import('fabric')>>['IText'],
  el:           SceneElement,
  t:            number
): Promise<void> {
  const base = {
    left:   el.transform.x,
    top:    el.transform.y,
    scaleX: el.transform.scaleX,
    scaleY: el.transform.scaleY,
    angle:  el.transform.rotation,
  };

  if (el.type === 'image' && el.src) {
    const img = await FabricImage.fromURL(el.src, { crossOrigin: 'anonymous' });
    img.set(base);
    fabric.add(img);
    return;
  }

  if (el.type === 'text') {
    const textObj = new IText(el.text ?? '', {
      ...base,
      fontSize:   el.fontSize ?? 72,
      fontFamily: el.fontFamily ?? 'sans-serif',
      fill:       el.fill ?? '#ffffff',
    });
    applyEffectAtTime(textObj, el.animationEffect ?? 'none', t);
    fabric.add(textObj);
  }
}

// ── Simula efeitos de animação de forma determinística por timestamp ──────────

type FabricObj = { set: (p: Record<string, unknown>) => void; left: number; top: number; opacity?: number };

function applyEffectAtTime(obj: FabricObj, effect: string, t: number): void {
  const origLeft = obj.left;
  const origTop  = obj.top;

  if (effect === 'tremor') {
    // Seed determinística baseada no tempo para reprodutibilidade
    const seed      = Math.sin(t * 137.5) * 43758.5453;
    const rx        = (seed - Math.floor(seed) - 0.5) * 6;
    const seed2     = Math.sin(t * 251.3) * 43758.5453;
    const ry        = (seed2 - Math.floor(seed2) - 0.5) * 6;
    obj.set({ left: origLeft + rx, top: origTop + ry });
    return;
  }

  if (effect === 'neon') {
    const flicker = 0.7 + Math.sin(t * 8) * 0.3;
    obj.set({ opacity: flicker });
    return;
  }

  if (effect === 'ticker') {
    const speed  = 2 * EXPORT_FPS; // pixels por segundo
    const offset = (t * speed) % (EXPORT_WIDTH + 400);
    obj.set({ left: EXPORT_WIDTH - offset });
  }
}
