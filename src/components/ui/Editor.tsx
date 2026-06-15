'use client';

import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import type { Scene, ActivePause } from '@/store/projectStore';
import MainCanvas, { type MainCanvasHandle } from '@/components/canvas/MainCanvas';
import ActivePauseCanvas from '@/components/canvas/ActivePauseCanvas';
import EditorShell from '@/components/ui/EditorShell';
import SceneList from '@/components/timeline/SceneList';
import ElementTimeline from '@/components/timeline/ElementTimeline';
import LetteringPanel from '@/components/typography/LetteringPanel';
import ExportModal from '@/components/ui/ExportModal';
import { getItemAtTime } from '@/utils/timeHelpers';

const CANVAS_W = 1280;
const CANVAS_H = 720;

export default function Editor() {
  const project       = useProjectStore((s) => s.project!);
  const activeSceneId = useProjectStore((s) => s.project?.activeSceneId);
  const currentTime   = useProjectStore((s) => s.project?.currentTime ?? 0);
  const closeProject  = useProjectStore((s) => s.closeProject);
  const setActiveScene = useProjectStore((s) => s.setActiveScene);

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

  // Sincroniza cena ativa com o currentTime global
  useEffect(() => {
    const { item } = getItemAtTime(project.timeline, currentTime);
    if (item && item.id !== activeSceneId) {
      setActiveScene(item.id);
    }
  }, [currentTime, project.timeline, activeSceneId, setActiveScene]);

  const activeItem = project.timeline.find((i) => i.id === activeSceneId)
    ?? project.timeline[0];

  const isScene = activeItem && 'elements' in activeItem;
  const isPause = activeItem && !isScene;

  return (
    <>
      {showExport && (
        <ExportModal projectName={project.name} onClose={() => setShowExport(false)} />
      )}

      <EditorShell
        projectName={project.name}
        lettering={showLettering}
        onLettering={() => setLettering((v) => !v)}
        onExport={() => setShowExport(true)}
        onBack={closeProject}
      >
        {/* Painel de Lettering (toggle) — coluna à esquerda do canvas */}
        {showLettering && isScene && (
          <aside
            className="flex flex-col overflow-hidden border-r"
            style={{ width: 'var(--layout-lettering)', borderColor: 'var(--border)' }}
          >
            <LetteringPanel
              scene={activeItem as Scene}
              onAddText={(el) => canvasRef.current?.addText(el)}
              onSetEffect={(id, fx) => canvasRef.current?.setEffect(id, fx)}
            />
          </aside>
        )}

        {/* Stack central: canvas + timelines */}
        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Canvas — área principal */}
          <div
            className="flex flex-1 items-center justify-center overflow-hidden p-4"
            style={{ background: 'var(--bg-surface)' }}
          >
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

          {/* SceneList com drag & drop (inclui régua, trilhas de áudio e playhead) */}
          <SceneList />
        </section>
      </EditorShell>
    </>
  );
}
