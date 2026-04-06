'use client';

import { useEffect, useRef, useState } from 'react';
import { Type, Download, ChevronLeft } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import type { Scene, ActivePause } from '@/store/projectStore';
import MainCanvas, { type MainCanvasHandle } from '@/components/canvas/MainCanvas';
import ActivePauseCanvas from '@/components/canvas/ActivePauseCanvas';
import AssetSidebar from '@/components/ui/AssetSidebar';
import SceneList from '@/components/timeline/SceneList';
import AudioTrackArea from '@/components/timeline/AudioTrackArea';
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
    <div className="flex h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden">
      {showExport && (
        <ExportModal projectName={project.name} onClose={() => setShowExport(false)} />
      )}

      {/* Sidebar de assets + botão Lettering */}
      <div className="flex flex-col h-full border-r border-white/8">
        <AssetSidebar />
        <div className="px-5 py-5 border-t border-white/8">
          <button
            onClick={() => setLettering((v) => !v)}
            className={`flex items-center justify-center gap-2.5 w-full rounded-xl px-4 py-3.5 text-sm font-semibold border transition-all ${showLettering ? 'bg-white/12 text-white border-white/20' : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10'}`}
          >
            <Type size={15} />
            Lettering
          </button>
        </div>
      </div>

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
        <header className="flex items-center justify-between pl-16 pr-28 py-6 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={closeProject}
              title="Voltar ao início"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-black tracking-tighter text-lg text-white/90">Glyph</span>
          </div>
          <span className="text-sm font-mono text-white/35 truncate max-w-[240px]">{project.name}</span>
          <div>
            <button
              onClick={() => setShowExport(true)}
              className="flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold bg-white text-black hover:bg-white/90 transition-all"
            >
              <Download size={15} />
              Exportar
            </button>
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

        {/* Trilhas de áudio */}
        <AudioTrackArea />

      </div>
    </div>
  );
}
