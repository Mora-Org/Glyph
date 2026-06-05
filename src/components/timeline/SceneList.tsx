'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Clapperboard, PauseCircle, Monitor, Tv2, Palette, Play, Pause } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import type { Scene, ActivePause, TimelineItem, PauseType, TransitionType } from '@/store/projectStore';
import TransitionBadge from './TransitionBadge';

import { PIXELS_PER_SECOND } from './TimelineConstants';
import { getTotalDuration } from '@/utils/timeHelpers';
import GlobalRuler from './GlobalRuler';
import Playhead from './Playhead';
import { AudioTrackLabels, AudioTrackLanes } from './AudioTrackArea';

// ── Item de Cena ─────────────────────────────────────────────────────────────

function SceneItem({ scene, isActive, onClick }: {
  scene: Scene;
  isActive: boolean;
  onClick: () => void;
}) {
  const updateScene = useProjectStore((s) => s.updateScene);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: scene.id });

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startDur = scene.duration;

    function onMouseMove(mv: MouseEvent) {
      const dx = mv.clientX - startX;
      const dt = dx / PIXELS_PER_SECOND;
      const newDur = Math.max(0.1, startDur + dt);
      updateScene(scene.id, { duration: Math.round(newDur * 100) / 100 });
    }

    function onMouseUp() {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [scene.id, scene.duration, updateScene]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    width:   scene.duration * PIXELS_PER_SECOND,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex-shrink-0 h-full relative group pb-1">
      <div className={`
        flex flex-col h-full overflow-hidden
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
          className="flex-1 flex flex-col items-center justify-center px-2 py-2 text-center cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-[10px] font-semibold truncate w-full text-center">{scene.name}</span>
          <span className={`text-[9px] font-mono mt-0.5 ${isActive ? 'text-black/50' : 'text-white/60'}`}>
            {scene.duration}s
          </span>
        </button>
      </div>

      {/* Alça de redimensionamento (Right Handle) */}
      <div
        onMouseDown={onResizeStart}
        className="absolute top-0 right-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 flex items-center justify-center z-10"
        title="Arrastar para redimensionar duração"
      >
        <div className="w-1 h-8 bg-white/20 rounded-full" />
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
    width:   pause.duration * PIXELS_PER_SECOND,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex-shrink-0 h-full">
      <div className={`
        flex flex-col h-full overflow-hidden
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

        <div className="flex flex-col items-center justify-center px-2 py-2">
          <span className="text-[10px] font-mono font-bold leading-none">{pauseLabels[pause.type]}</span>
          <span className="text-[9px] font-mono mt-1 opacity-70">{pause.duration}s</span>
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

  const currentTime   = useProjectStore((s) => s.project?.currentTime ?? 0);

  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [isPlaying, setIsPlaying]         = useState(false);
  const rafRef = useRef<number>(0);

  const total      = getTotalDuration(project.timeline);
  const totalWidth = total * PIXELS_PER_SECOND;

  // Loop de reprodução: avança currentTime em tempo real e move o playhead.
  // Lê o estado fresco via getState() a cada frame para evitar reiniciar o efeito.
  useEffect(() => {
    if (!isPlaying) return;

    const start = useProjectStore.getState();
    const dur   = getTotalDuration(start.project?.timeline ?? []);
    if (dur <= 0) { setIsPlaying(false); return; }
    if ((start.project?.currentTime ?? 0) >= dur) start.seekTo(0);

    let last = performance.now();
    const step = (now: number) => {
      const s = useProjectStore.getState();
      if (!s.project) return;
      const d  = getTotalDuration(s.project.timeline);
      const dt = (now - last) / 1000;
      last = now;
      const next = s.project.currentTime + dt;
      if (next >= d) {
        s.seekTo(d);
        setIsPlaying(false);
        return;
      }
      s.seekTo(next);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying]);

  // PointerSensor: drag por ponteiro (exige movimento ≥6px para não conflitar com clique).
  // KeyboardSensor: reordenação acessível por teclado (Space ativa, setas movem, Space solta)
  // — também torna a reordenação automatável por ferramentas de QA headless.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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
    <div className="flex flex-col border-t border-white/8 min-h-[140px] bg-[#0d0d0d] relative">
      <div className="flex items-stretch flex-1 overflow-hidden">

        {/* ── Gutter fixo: transporte + labels (fora do eixo de tempo) ── */}
        <div className="w-32 flex-shrink-0 border-r border-white/8 flex flex-col">
          {/* Linha alinhada com a régua: play/pause + leitura de tempo */}
          <div className="h-6 border-b border-white/10 bg-black/20 flex items-center gap-2 px-3">
            <button
              onClick={() => setIsPlaying((v) => !v)}
              aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
              data-testid="transport-play"
              className="text-white/50 hover:text-white transition-colors"
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            </button>
            <span className="text-[9px] font-mono text-white/40 tabular-nums">
              {currentTime.toFixed(1)} / {total.toFixed(1)}s
            </span>
          </div>
          {/* Linha alinhada com a faixa de cenas */}
          <div className="h-[80px] flex items-center px-3 border-b border-white/8">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">Cenas</span>
          </div>
          {/* Labels das trilhas de áudio */}
          <AudioTrackLabels />
        </div>

        {/* ── Coluna de tempo (scroll horizontal) — eixo único x=0 = t=0 ── */}
        <div
          id="global-timeline-area"
          className="flex-1 overflow-x-auto min-w-0 relative"
        >
          <div className="relative" style={{ width: totalWidth, minWidth: '100%' }}>
            {/* Régua */}
            <GlobalRuler />

            {/* Faixa de cenas/pausas */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
                <div className="flex items-stretch h-[80px] relative border-b border-white/8">
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

                        {/* Badge de transição: largura 0 no fluxo, flutua sobre a junção */}
                        {isScene && index < project.timeline.length - 1 && (
                          <span className="relative z-20 h-full" style={{ width: 0 }}>
                            <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
                              <TransitionBadge
                                type={scene.transition}
                                onChange={(t) => handleTransitionChange(scene.id, t)}
                              />
                            </span>
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>

            {/* Lanes de áudio alinhadas ao eixo de tempo */}
            <AudioTrackLanes />

            {/* Playhead sobre régua + cenas + áudio */}
            <Playhead />
          </div>
        </div>

        {/* Ações — fora do overflow para o menu de pausa não ser cortado */}
        <div className="flex flex-col justify-center gap-2 px-6 border-l border-white/8 flex-shrink-0 relative">
          <button
            onClick={addScene}
            aria-label="Adicionar cena"
            data-testid="add-scene"
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white/60 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 transition-all w-full"
          >
            <Clapperboard size={14} />
            Cena
          </button>

          {/* Menu de pausa */}
          <div className="relative w-full">
            <button
              onClick={() => setShowPauseMenu((v) => !v)}
              aria-label="Adicionar pausa"
              data-testid="add-pause"
              className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white/60 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 transition-all w-full"
            >
              <PauseCircle size={14} />
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
    </div>
  );
}
