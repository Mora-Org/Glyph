'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Clapperboard, PauseCircle, Monitor, Tv2, Palette } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import type { Scene, ActivePause, TimelineItem, PauseType, TransitionType } from '@/store/projectStore';
import TransitionBadge from './TransitionBadge';

// ── Item de Cena ─────────────────────────────────────────────────────────────

function SceneItem({ scene, isActive, onClick }: {
  scene: Scene;
  isActive: boolean;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: scene.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex-shrink-0">
      <div className={`
        flex flex-col rounded-xl w-44 overflow-hidden
        border transition-all
        ${isActive
          ? 'bg-white text-black border-white/40 shadow-[0_0_14px_rgba(255,255,255,0.12)]'
          : 'glass text-white/80 border-white/15'}
      `}>
        {/* Handle de drag — tira fina no topo do card */}
        <div
          {...attributes}
          {...listeners}
          className="flex justify-center items-center gap-0.5 py-1.5 cursor-grab active:cursor-grabbing opacity-25 hover:opacity-60 transition-opacity"
          aria-label="Arrastar cena"
          title="Arrastar para reordenar"
        >
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} className={`w-0.5 h-0.5 rounded-full ${isActive ? 'bg-black' : 'bg-white'}`} />
          ))}
        </div>

        <button
          onClick={onClick}
          className="flex flex-col items-center justify-center px-5 py-5 text-center cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-xs font-semibold truncate w-full text-center">{scene.name}</span>
          <span className={`text-[11px] font-mono mt-1.5 ${isActive ? 'text-black/50' : 'text-white/60'}`}>
            {scene.duration}s · {scene.elements.length} elem.
          </span>
        </button>
      </div>
    </div>
  );
}

// ── Item de Pausa Ativa ──────────────────────────────────────────────────────

const pauseLabels: Record<PauseType, string> = { black: '■ PRETO', vhs: '▓ VHS', solid: '● COR' };
const pauseColors: Record<PauseType, string> = {
  black: 'border-white/10 text-white/30',
  vhs:   'border-purple-500/30 text-purple-400/70',
  solid: 'border-yellow-500/30 text-yellow-400/70',
};

function PauseItem({ pause }: { pause: ActivePause }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: pause.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex-shrink-0">
      <div className={`
        flex flex-col rounded-lg w-28 overflow-hidden
        glass border ${pauseColors[pause.type]}
      `}>
        {/* Handle de drag — tira no topo do card de pausa */}
        <div
          {...attributes}
          {...listeners}
          className="flex justify-center items-center gap-0.5 py-1.5 cursor-grab active:cursor-grabbing opacity-40 hover:opacity-70 transition-opacity"
          aria-label="Arrastar pausa"
          title="Arrastar para reordenar"
        >
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} className="w-0.5 h-0.5 rounded-full bg-current" />
          ))}
        </div>

        <div className="flex flex-col items-center justify-center px-4 py-4">
          <span className="text-[10px] font-mono font-bold">{pauseLabels[pause.type]}</span>
          <span className="text-[10px] font-mono mt-1 opacity-70">{pause.duration}s</span>
        </div>
      </div>
    </div>
  );
}

// ── SceneList principal ──────────────────────────────────────────────────────

export default function SceneList() {
  const project       = useProjectStore((s) => s.project!);
  const activeSceneId = useProjectStore((s) => s.project?.activeSceneId);
  const setActive     = useProjectStore((s) => s.setActiveScene);
  const addScene      = useProjectStore((s) => s.addScene);
  const addPause      = useProjectStore((s) => s.addPause);
  const updateScene   = useProjectStore((s) => s.updateScene);
  const reorder       = useProjectStore((s) => s.reorderTimeline);

  const [showPauseMenu, setShowPauseMenu] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 6 },
  }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = project.timeline.map((i) => i.id);
    const from = ids.indexOf(active.id as string);
    const to   = ids.indexOf(over.id as string);
    if (from !== -1 && to !== -1) reorder(from, to);
  }

  function handleTransitionChange(sceneId: string, t: TransitionType) {
    updateScene(sceneId, { transition: t });
  }

  const ids = project.timeline.map((i) => i.id);

  return (
    // Wrapper sem overflow — permite que o menu de pausa apareça fora do scroll
    <div className="flex items-stretch border-t border-white/8 min-h-[10vh]">

      {/* Área scrollável com as cenas/pausas */}
      <div className="flex items-center gap-3 px-4 overflow-x-auto flex-1 min-w-0">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
            {project.timeline.map((item: TimelineItem, index: number) => {
              const isScene = 'elements' in item;
              const scene   = item as Scene;
              const pause   = item as ActivePause;

              return (
                <React.Fragment key={item.id}>
                  {isScene ? (
                    <SceneItem
                      scene={scene}
                      isActive={scene.id === activeSceneId}
                      onClick={() => setActive(scene.id)}
                    />
                  ) : (
                    <PauseItem pause={pause} />
                  )}

                  {/* Badge de transição entre cenas adjacentes */}
                  {isScene && index < project.timeline.length - 1 && (
                    <TransitionBadge
                      type={scene.transition}
                      onChange={(t) => handleTransitionChange(scene.id, t)}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </SortableContext>
        </DndContext>
      </div>

      {/* Ações — fora do overflow para o menu de pausa não ser cortado */}
      <div className="flex flex-col justify-center gap-3 px-10 py-6 mr-12 border-l border-white/8 flex-shrink-0 relative min-w-[160px]">
        <button
          onClick={addScene}
          aria-label="Adicionar cena"
          data-testid="add-scene"
          className="flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold text-white/60 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 transition-all w-full"
        >
          <Clapperboard size={15} />
          Cena
        </button>

        {/* Menu de pausa */}
        <div className="relative w-full">
          <button
            onClick={() => setShowPauseMenu((v) => !v)}
            aria-label="Adicionar pausa"
            data-testid="add-pause"
            className="flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold text-white/60 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 transition-all w-full"
          >
            <PauseCircle size={15} />
            Pausa
          </button>
          {showPauseMenu && (
            <div
              className="absolute right-0 glass-panel border border-white/12 p-1 flex flex-col gap-0.5 z-50 min-w-[130px]"
              style={{ bottom: 'calc(100% + 6px)' }}
            >
              <button
                onClick={() => { addPause('black', 3); setShowPauseMenu(false); }}
                className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-white/60 hover:text-white hover:bg-white/8 rounded transition-colors"
              >
                <Monitor size={12} /> Tela Preta
              </button>
              <button
                onClick={() => { addPause('vhs', 3); setShowPauseMenu(false); }}
                className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-white/60 hover:text-white hover:bg-white/8 rounded transition-colors"
              >
                <Tv2 size={12} /> Ruído VHS
              </button>
              <button
                onClick={() => { addPause('solid', 3); setShowPauseMenu(false); }}
                className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-white/60 hover:text-white hover:bg-white/8 rounded transition-colors"
              >
                <Palette size={12} /> Cor Sólida
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
