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
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <button
        onClick={onClick}
        className={`
          flex flex-col items-start px-3 py-2 rounded-lg w-28 flex-shrink-0
          border transition-all text-left cursor-pointer
          ${isActive
            ? 'bg-white text-black border-white'
            : 'glass text-white/60 border-white/10 hover:text-white hover:border-white/25'}
        `}
      >
        <span className="text-[10px] font-mono font-bold truncate w-full">{scene.name}</span>
        <span className={`text-[9px] font-mono mt-0.5 ${isActive ? 'text-black/50' : 'text-white/30'}`}>
          {scene.duration}s · {scene.elements.length} elem.
        </span>
      </button>
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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={`
        flex flex-col items-start px-3 py-2 rounded-lg w-20 flex-shrink-0
        glass border cursor-grab ${pauseColors[pause.type]}
      `}>
        <span className="text-[9px] font-mono font-bold">{pauseLabels[pause.type]}</span>
        <span className="text-[9px] font-mono mt-0.5 opacity-60">{pause.duration}s</span>
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
    <div className="flex items-center gap-0 px-4 py-2 border-t border-white/8 overflow-x-auto">
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

      {/* Ações */}
      <div className="flex items-center gap-1 ml-3 flex-shrink-0">
        <button
          onClick={addScene}
          className="glass px-2 py-1.5 rounded-lg text-[10px] font-mono text-white/40 hover:text-white border border-white/8 hover:border-white/20 transition-all"
        >
          + Cena
        </button>

        {/* Menu de pausa */}
        <div className="relative">
          <button
            onClick={() => setShowPauseMenu((v) => !v)}
            className="glass px-2 py-1.5 rounded-lg text-[10px] font-mono text-white/40 hover:text-white border border-white/8 hover:border-white/20 transition-all"
          >
            + Pausa
          </button>
          {showPauseMenu && (
            <div className="absolute bottom-9 left-0 glass-panel border border-white/10 p-1 flex flex-col gap-0.5 z-50 min-w-[120px]">
              {(['black', 'vhs', 'solid'] as PauseType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => { addPause(type, 3); setShowPauseMenu(false); }}
                  className="text-left px-3 py-1.5 text-xs font-mono text-white/60 hover:text-white hover:bg-white/8 rounded transition-colors"
                >
                  {pauseLabels[type]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
