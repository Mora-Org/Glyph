'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import type { Scene, ActivePause } from '@/store/projectStore';
import MainCanvas, { type MainCanvasHandle } from '@/components/canvas/MainCanvas';
import ActivePauseCanvas from '@/components/canvas/ActivePauseCanvas';
import AssetSidebar from '@/components/ui/AssetSidebar';
import Button from '@/components/ui/Button';
import SceneList from '@/components/timeline/SceneList';
import ElementTimeline from '@/components/timeline/ElementTimeline';
import LetteringPanel from '@/components/typography/LetteringPanel';
import ExportModal from '@/components/ui/ExportModal';

const CANVAS_W = 1280;
const CANVAS_H = 720;

export default function Editor() {
  const project       = useProjectStore((s) => s.project!);
  const activeSceneId = useProjectStore((s) => s.project?.activeSceneId);

  const [opacity, setOpacity]         = useState(1);
  const [showLettering, setLettering] = useState(false);
  const [showExport, setShowExport]   = useState(false);
  const prevSceneId                   = useRef<string | null>(null);
  const canvasRef = useRef<MainCanvasHandle | null>(null);

  // Fade transition quando troca de cena
  useEffect(() => {
    if (!activeSceneId) return;
    if (prevSceneId.current === null) {
      prevSceneId.current = activeSceneId;
      return;
    }
    if (prevSceneId.current === activeSceneId) return;

    const item = project.timeline.find((i) => i.id === prevSceneId.current);
    const transition = (item && 'transition' in item) ? (item as Scene).transition : 'cut';

    prevSceneId.current = activeSceneId;

    if (transition === 'fade') {
      setOpacity(0);
      requestAnimationFrame(() => {
        setTimeout(() => setOpacity(1), 20);
      });
    }
  }, [activeSceneId, project.timeline]);

  const activeItem = project.timeline.find((i) => i.id === activeSceneId)
    ?? project.timeline[0];

  const isScene = activeItem && 'elements' in activeItem;
  const isPause = activeItem && !isScene;

  return (
    <div className="flex h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden">
      {showExport && (
        <ExportModal projectName={project.name} onClose={() => setShowExport(false)} />
      )}

      {/* Sidebar de assets */}
      <AssetSidebar />

      {/* Painel de Lettering (toggle) */}
      {showLettering && isScene && (
        <div className="w-52 border-r border-white/8 overflow-hidden flex flex-col">
          <LetteringPanel
            scene={activeItem as import('@/store/projectStore').Scene}
            onAddText={(el) => canvasRef.current?.addText(el)}
            onSetEffect={(id, fx) => canvasRef.current?.setEffect(id, fx)}
          />
        </div>
      )}

      {/* Área central */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-4 py-2 border-b border-white/8 flex-shrink-0">
          <span className="font-black tracking-tighter text-lg">Glyph</span>
          <span className="text-xs font-mono text-white/40">{project.name}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLettering((v) => !v)}
              className={`glass-button text-xs px-3 py-1.5 ${showLettering ? 'bg-white/15' : ''}`}
            >
              ✦ Lettering
            </button>
            <Button variant="primary" size="sm" onClick={() => setShowExport(true)}>Exportar</Button>
          </div>
        </header>

        {/* Canvas — área principal */}
        <div className="flex flex-1 items-center justify-center overflow-hidden p-4 bg-[#080808]">
          <div
            style={{
              opacity,
              transition: opacity === 0 ? 'none' : 'opacity 300ms ease-in',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            {isScene && (
              <MainCanvas ref={canvasRef} scene={activeItem as Scene} />
            )}
            {isPause && (
              <ActivePauseCanvas
                pause={activeItem as ActivePause}
                width={CANVAS_W}
                height={CANVAS_H}
              />
            )}
          </div>
        </div>

        {/* Timeline interna de elementos */}
        {isScene && (
          <ElementTimeline scene={activeItem as Scene} />
        )}

        {/* SceneList com drag & drop */}
        <SceneList />

      </div>
    </div>
  );
}
