'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { Canvas as FabricCanvas, FabricObject } from 'fabric';
import { useProjectStore } from '@/store/projectStore';
import type { SceneElement, AnimationEffect } from '@/store/projectStore';

interface UseFabricCanvasOptions {
  sceneId: string;
  width: number;
  height: number;
}

// Mapa dos loops de animação ativos: pegId → cancelFn
const animationLoops = new Map<string, () => void>();

export function useFabricCanvas({ sceneId, width, height }: UseFabricCanvasOptions) {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const fabricRef     = useRef<FabricCanvas | null>(null);
  const updateElement = useProjectStore((s) => s.updateElement);
  const selectElement = useProjectStore((s) => s.selectElement);

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    let cancelled = false;
    let canvas: FabricCanvas;

    import('fabric').then(({ Canvas }) => {
      // Guarda contra double-invoke do React Strict Mode: cleanup pode ter rodado
      // antes desta promise resolver
      if (cancelled || !canvasRef.current) return;

      canvas = new Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#000000',
        preserveObjectStacking: true,
        selection: true,
      });

      applyGlyphControls(canvas);

      canvas.on('object:modified', (e) => {
        const obj = e.target as FabricObject & { pegId?: string };
        if (!obj?.pegId) return;
        updateElement(sceneId, obj.pegId, {
          transform: {
            x: obj.left ?? 0,
            y: obj.top ?? 0,
            width: obj.getScaledWidth(),
            height: obj.getScaledHeight(),
            rotation: obj.angle ?? 0,
            scaleX: obj.scaleX ?? 1,
            scaleY: obj.scaleY ?? 1,
          },
        });
      });

      // Seleção → store (one-way; obj.set programático não re-emite estes eventos)
      const readPegId = (o: unknown): string | null =>
        (o as (FabricObject & { pegId?: string }) | undefined)?.pegId ?? null;
      canvas.on('selection:created', (e) => selectElement(readPegId(e.selected?.[0])));
      canvas.on('selection:updated', (e) => selectElement(readPegId(e.selected?.[0])));
      canvas.on('selection:cleared', () => selectElement(null));

      fabricRef.current = canvas;
    });

    return () => {
      cancelled = true;
      animationLoops.forEach((cancel) => cancel());
      animationLoops.clear();
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.setDimensions({ width, height });
    fabricRef.current.renderAll();
  }, [width, height]);

  // ── Imagem ────────────────────────────────────────────────────────────────

  const addImage = useCallback(async (element: SceneElement) => {
    const { FabricImage } = await import('fabric');
    const img = await FabricImage.fromURL(element.src!, { crossOrigin: 'anonymous' });
    img.set({
      left:    element.transform.x,
      top:     element.transform.y,
      scaleX:  element.transform.scaleX,
      scaleY:  element.transform.scaleY,
      angle:   element.transform.rotation,
    });
    (img as unknown as { pegId: string }).pegId = element.id;
    fabricRef.current?.add(img);
    fabricRef.current?.renderAll();
  }, []);

  // ── Vídeo ─────────────────────────────────────────────────────────────────

  const addVideo = useCallback(async (element: SceneElement) => {
    const { FabricImage } = await import('fabric');

    const videoEl = document.createElement('video');
    videoEl.src = element.src!;
    videoEl.crossOrigin = 'anonymous';
    videoEl.loop = true;
    videoEl.muted = true;
    videoEl.playsInline = true;

    await new Promise<void>((resolve) => {
      videoEl.addEventListener('loadeddata', () => resolve(), { once: true });
      videoEl.load();
    });

    const fabricVideo = new FabricImage(videoEl, {
      left:   element.transform.x,
      top:    element.transform.y,
      scaleX: element.transform.scaleX,
      scaleY: element.transform.scaleY,
      angle:  element.transform.rotation,
    });
    (fabricVideo as unknown as { pegId: string }).pegId = element.id;
    fabricRef.current?.add(fabricVideo);
    videoEl.play();

    let running = true;
    const tick = () => {
      if (!running || !fabricRef.current) return;
      fabricVideo.setElement(videoEl);
      fabricRef.current.renderAll();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    animationLoops.set(element.id, () => { running = false; });
  }, []);

  // ── GIF (gifler — frame-a-frame no canvas) ────────────────────────────────

  const addGif = useCallback(async (element: SceneElement) => {
    const { FabricImage } = await import('fabric');

    // Canvas temporário onde o gifler desenha os frames
    const gifCanvas = document.createElement('canvas');

    const gifler = (await import('gifler')).default;

    await new Promise<void>((resolve) => {
      gifler(element.src!).animate(gifCanvas, () => {
        // Primeiro frame carregado — resolve a promise
        resolve();
      });
      // fallback: resolve após 500ms caso o callback não seja chamado
      setTimeout(resolve, 500);
    });

    const fabricGif = new FabricImage(gifCanvas, {
      left:   element.transform.x,
      top:    element.transform.y,
      scaleX: element.transform.scaleX,
      scaleY: element.transform.scaleY,
      angle:  element.transform.rotation,
    });
    (fabricGif as unknown as { pegId: string }).pegId = element.id;
    fabricRef.current?.add(fabricGif);

    // gifler já anima gifCanvas por conta própria — só precisamos re-renderizar o Fabric
    let running = true;
    const tick = () => {
      if (!running || !fabricRef.current) return;
      fabricGif.setElement(gifCanvas);
      fabricRef.current.renderAll();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    animationLoops.set(element.id, () => { running = false; });
  }, []);

  // ── Texto / Lettering ─────────────────────────────────────────────────────

  const addText = useCallback(async (element: SceneElement) => {
    const { IText } = await import('fabric');

    const textObj = new IText(element.text ?? 'Texto', {
      left:       element.transform.x,
      top:        element.transform.y,
      angle:      element.transform.rotation,
      fontSize:   element.fontSize ?? 72,
      fontFamily: element.fontFamily ?? 'sans-serif',
      fill:       element.fill ?? '#ffffff',
      selectable: true,
      editable:   true,
    });
    (textObj as unknown as { pegId: string }).pegId = element.id;

    // Sincroniza texto editado com o store
    textObj.on('editing:exited', () => {
      updateElement(sceneId, element.id, { text: textObj.text });
    });

    fabricRef.current?.add(textObj);
    fabricRef.current?.renderAll();

    // Aplica efeito de animação se houver
    if (element.animationEffect && element.animationEffect !== 'none') {
      applyEffect(textObj, element.id, element.animationEffect, fabricRef.current!);
    }
  }, [sceneId, updateElement]);

  // Atualiza a animação de um objeto existente no canvas
  const setElementEffect = useCallback((elementId: string, effect: AnimationEffect) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Cancela loop anterior
    animationLoops.get(elementId)?.();
    animationLoops.delete(elementId);

    const obj = canvas.getObjects().find(
      (o) => (o as unknown as { pegId?: string }).pegId === elementId
    );
    if (!obj) return;

    // Remove offsets anteriores
    obj.set({ left: obj.left, top: obj.top });

    if (effect !== 'none') {
      applyEffect(obj, elementId, effect, canvas);
    }
  }, []);

  // Aplica um patch do Properties direto no objeto Fabric (preview ao vivo).
  // obj.set programático NÃO dispara object:modified nem selection:* → one-way, sem loop.
  const applyPatch = useCallback((elementId: string, patch: Partial<SceneElement>) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const obj = canvas.getObjects().find(
      (o) => (o as unknown as { pegId?: string }).pegId === elementId
    );
    if (!obj) return;

    // Cast: fontSize/text/fontFamily só existem em IText, não em FabricObject base.
    const t = obj as unknown as { set: (o: Record<string, unknown>) => void; setCoords: () => void };
    if (patch.transform?.x        !== undefined) t.set({ left:  patch.transform.x });
    if (patch.transform?.y        !== undefined) t.set({ top:   patch.transform.y });
    if (patch.transform?.rotation !== undefined) t.set({ angle: patch.transform.rotation });
    if (patch.fill                !== undefined) t.set({ fill:  patch.fill });
    if (patch.text                !== undefined) t.set({ text:  patch.text });
    if (patch.fontSize            !== undefined) t.set({ fontSize: patch.fontSize });
    if (patch.fontFamily          !== undefined) t.set({ fontFamily: patch.fontFamily });

    t.setCoords();
    canvas.requestRenderAll();
  }, []);

  return { canvasRef, fabricRef, addImage, addVideo, addGif, addText, setElementEffect, applyPatch };
}

// ── Efeitos de animação ───────────────────────────────────────────────────────

function applyEffect(
  obj: FabricObject,
  id: string,
  effect: AnimationEffect,
  canvas: FabricCanvas
) {
  const origLeft = obj.left ?? 0;
  const origTop  = obj.top  ?? 0;
  let running    = true;

  if (effect === 'tremor') {
    const intensity = 3;
    const tick = () => {
      if (!running) { obj.set({ left: origLeft, top: origTop }); canvas.renderAll(); return; }
      obj.set({
        left: origLeft + (Math.random() - 0.5) * intensity * 2,
        top:  origTop  + (Math.random() - 0.5) * intensity * 2,
      });
      canvas.renderAll();
      setTimeout(() => requestAnimationFrame(tick), 40); // ~25fps
    };
    requestAnimationFrame(tick);
  }

  if (effect === 'neon') {
    let t = 0;
    const tick = () => {
      if (!running) { (obj as unknown as { opacity: number }).opacity = 1; canvas.renderAll(); return; }
      t += 0.08;
      // Pisca com frequência irregular — estilo neon
      const flicker = Math.random() > 0.97 ? 0.2 : (0.7 + Math.sin(t) * 0.3);
      (obj as unknown as { opacity: number }).opacity = flicker;
      canvas.renderAll();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  if (effect === 'ticker') {
    let x = origLeft;
    const speed = 2;
    const canvasW = canvas.width ?? 1280;
    const objW    = obj.getScaledWidth();
    const tick = () => {
      if (!running) { obj.set({ left: origLeft }); canvas.renderAll(); return; }
      x -= speed;
      if (x + objW < 0) x = canvasW;
      obj.set({ left: x });
      canvas.renderAll();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  animationLoops.set(id, () => { running = false; });
}

// ── Estética Glyph nos handles ────────────────────────────────────────────────

function applyGlyphControls(canvas: FabricCanvas) {
  import('fabric').then(({ controlsUtils, Control }) => {
    const { scalingX, scalingY, scalingEqually, rotationWithSnapping } = controlsUtils;

    const controlStyle = {
      cornerColor:        '#ffffff',
      cornerStrokeColor:  'rgba(255,255,255,0.3)',
      cornerStyle:        'circle' as const,
      cornerSize:         10,
      transparentCorners: false,
      borderColor:        'rgba(255,255,255,0.4)',
      borderScaleFactor:  1,
      borderDashArray:    [4, 4],
    };

    canvas.on('object:added', (e) => {
      const obj = e.target;
      if (!obj) return;
      obj.set(controlStyle);
      obj.controls = {
        ml:  new Control({ x: -0.5, y:  0,   actionHandler: scalingX,       cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler }),
        mr:  new Control({ x:  0.5, y:  0,   actionHandler: scalingX,       cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler }),
        mt:  new Control({ x:  0,   y: -0.5, actionHandler: scalingY,       cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler }),
        mb:  new Control({ x:  0,   y:  0.5, actionHandler: scalingY,       cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler }),
        tl:  new Control({ x: -0.5, y: -0.5, actionHandler: scalingEqually }),
        tr:  new Control({ x:  0.5, y: -0.5, actionHandler: scalingEqually }),
        bl:  new Control({ x: -0.5, y:  0.5, actionHandler: scalingEqually }),
        br:  new Control({ x:  0.5, y:  0.5, actionHandler: scalingEqually }),
        mtr: new Control({
          x: 0, y: -0.5, offsetY: -30,
          actionHandler:     rotationWithSnapping,
          cursorStyleHandler: () => 'crosshair',
          render:            renderRotateHandle,
        }),
      };
    });
  });
}

function renderRotateHandle(ctx: CanvasRenderingContext2D, left: number, top: number) {
  ctx.save();
  ctx.translate(left, top);
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}
