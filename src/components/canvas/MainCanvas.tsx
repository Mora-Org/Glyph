'use client';

import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { useFabricCanvas } from '@/hooks/useFabricCanvas';
import { useProjectStore } from '@/store/projectStore';
import type { Scene, SceneElement, AnimationEffect } from '@/store/projectStore';

const CANVAS_W = 1280;
const CANVAS_H = 720;

export interface MainCanvasHandle {
  addText:   (el: SceneElement) => void;
  setEffect: (id: string, fx: AnimationEffect) => void;
}

interface MainCanvasProps {
  scene: Scene;
}

const MainCanvas = forwardRef<MainCanvasHandle, MainCanvasProps>(function MainCanvas({ scene }, ref) {
  const { canvasRef, fabricRef, addImage, addVideo, addGif, addText, setElementEffect } =
    useFabricCanvas({ sceneId: scene.id, width: CANVAS_W, height: CANVAS_H });

  const addElement = useProjectStore((s) => s.addElement);

  // Expõe ações para o Editor via ref
  useImperativeHandle(ref, () => ({
    addText,
    setEffect: setElementEffect,
  }), [addText, setElementEffect]);

  // Carrega elementos da cena
  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.clear();
    fabricRef.current.backgroundColor = '#000000';
    scene.elements.forEach((el) => {
      if (el.type === 'image') addImage(el);
      if (el.type === 'video') addVideo(el);
      if (el.type === 'gif')   addGif(el);
      if (el.type === 'text')  addText(el);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id]);

  // Drop de arquivo no canvas
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    Array.from(e.dataTransfer.files).forEach((file) => {
      const url     = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      const isGif   = file.name.toLowerCase().endsWith('.gif');
      const type    = isVideo ? 'video' : isGif ? 'gif' : 'image';
      const id      = Math.random().toString(36).slice(2, 10);

      const element: SceneElement = {
        id,
        type: type as SceneElement['type'],
        src: url,
        startTime: 0,
        endTime: scene.duration,
        transform: {
          x: CANVAS_W / 2 - 200,
          y: CANVAS_H / 2 - 150,
          width: 400,
          height: 300,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
        zIndex: scene.elements.length,
      };

      addElement(scene.id, element);
      if (type === 'image') addImage(element);
      else if (type === 'video') addVideo(element);
      else if (type === 'gif') addGif(element);
    });
  }

  return (
    <div
      className="relative flex items-center justify-center bg-black/60"
      style={{ width: CANVAS_W, height: CANVAS_H }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <canvas ref={canvasRef} />

      {scene.elements.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 border border-dashed border-white/10 rounded">
          <span className="text-4xl opacity-20">+</span>
          <p className="text-xs font-mono text-white/30">
            Arraste imagens, vídeos ou GIFs para começar
          </p>
        </div>
      )}
    </div>
  );
});

export default MainCanvas;
