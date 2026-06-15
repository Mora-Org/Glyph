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

import { Clapperboard, PauseCircle, Monitor, Tv2, Palette } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import type { Scene, ActivePause, TimelineItem, PauseType, TransitionType } from '@/store/projectStore';
import TransitionBadge from './TransitionBadge';
import Transport from './Transport';

import { PIXELS_PER_SECOND } from './TimelineConstants';
import { getTotalDuration } from '@/utils/timeHelpers';
import GlobalRuler from './GlobalRuler';
import Playhead from './Playhead';
import { AudioTrackLabels, AudioTrackLanes } from './AudioTrackArea';

// ── Item de Cena ─────────────────────────────────────────────────────────────

function SceneItem({ scene, isActive, beatNumber, onClick }: {
  scene: Scene;
  isActive: boolean;
  beatNumber: number;
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
      {/* Borda 1px em ambos os estados (não muda layout); ativo ganha barra accent via inset shadow */}
      <div
        className={`flex flex-col h-full overflow-hidden rounded-md border transition-colors ${
          isActive ? 'bg-bg-elevated border-border' : 'bg-bg-surface border-border'
        }`}
        style={isActive ? { boxShadow: 'inset 2px 0 0 0 var(--accent)' } : undefined}
      >
        {/* Handle de drag — tira fina no topo do card */}
        <div
          {...attributes}
          {...listeners}
          data-testid={`drag-handle-${scene.id}`}
          className="flex justify-center items-center gap-0.5 py-1.5 cursor-grab active:cursor-grabbing opacity-30 hover:opacity-70 transition-opacity"
          aria-label="Arrastar cena"
          title="Arrastar para reordenar"
        >
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} className="w-0.5 h-0.5 rounded-full bg-text-muted" />
          ))}
        </div>

        <button
          onClick={onClick}
          className="flex-1 flex flex-col items-center justify-center px-2 py-1 text-center cursor-pointer hover:opacity-90 transition-opacity"
        >
          {/* Número do beat — a ordem carrega significado */}
          <span className="font-mono text-[7px] tracking-[0.08em] text-text-muted tabular-nums leading-none">
            {String(beatNumber).padStart(2, '0')}
          </span>
          {/* Nome em Fraunces — o beat editorial */}
          <span className="font-display font-extrabold text-[15px] tracking-[-0.04em] leading-tight text-text-primary truncate w-full text-center">
            {scene.name}
          </span>
          <span className="font-mono text-[9px] text-text-secondary tabular-nums mt-0.5">
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
        <div className="w-1 h-8 bg-border-strong rounded-full" />
      </div>
    </div>
  );
}

// ── Item de Pausa Ativa ──────────────────────────────────────────────────────

const pauseLabels: Record<PauseType, string> = { black: '■ PRETO', vhs: '▓ VHS', solid: '● COR' };
// Texturas do "respiro" — distinguem a pausa do beat de cena.
const pauseThumb: Record<PauseType, React.CSSProperties> = {
  black: { background: '#0d1020' },
  vhs:   { background: '#1A1F33', backgroundImage: 'repeating-linear-gradient(0deg, rgba(240,231,213,0.07) 0 1px, transparent 1px 4px)' },
  solid: { background: '#232940', backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(240,231,213,0.10) 1px, transparent 0)', backgroundSize: '5px 5px' },
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
      <div className="flex flex-col h-full overflow-hidden rounded-md border border-border bg-bg-surface">
        {/* Faixa de textura (o respiro) com o handle de drag por cima */}
        <div
          {...attributes}
          {...listeners}
          className="relative flex justify-center items-center gap-0.5 py-1.5 cursor-grab active:cursor-grabbing"
          style={pauseThumb[pause.type]}
          aria-label="Arrastar pausa"
          title="Arrastar para reordenar"
        >
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} className="w-0.5 h-0.5 rounded-full bg-text-muted" />
          ))}
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-2 py-2">
          <span className="text-[8.5px] font-mono font-bold uppercase tracking-[0.08em] leading-none text-text-secondary">{pauseLabels[pause.type]}</span>
          <span className="text-[9px] font-mono mt-1 text-text-muted tabular-nums">{pause.duration}s</span>
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

  // ── Transporte ───────────────────────────────────────────────────────────────
  // Rewind/Forward saltam para a borda de cena/pausa anterior/seguinte (snap no corte),
  // não em passos contínuos. Leem o estado fresco via getState() para servir tanto ao
  // clique quanto aos atalhos sem religar listeners.
  const togglePlay = useCallback(() => setIsPlaying((v) => !v), []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    useProjectStore.getState().seekTo(0);
  }, []);

  const rewind = useCallback(() => {
    const st = useProjectStore.getState();
    const tl = st.project?.timeline ?? [];
    const now = st.project?.currentTime ?? 0;
    let acc = 0;
    const bounds = [0];
    for (const it of tl) { acc += it.duration; bounds.push(acc); }
    const EPS = 0.05;
    let target = 0;
    for (const b of bounds) if (b < now - EPS) target = b; // maior borda antes de now
    st.seekTo(target);
  }, []);

  const forward = useCallback(() => {
    const st = useProjectStore.getState();
    const tl = st.project?.timeline ?? [];
    const now = st.project?.currentTime ?? 0;
    let acc = 0;
    const bounds = [0];
    for (const it of tl) { acc += it.duration; bounds.push(acc); }
    const EPS = 0.05;
    let target = acc; // fim, se não houver borda à frente
    for (let i = bounds.length - 1; i >= 0; i--) if (bounds[i] > now + EPS) target = bounds[i];
    st.seekTo(target);
  }, []);

  // Atalhos de transporte (J/K/L/Espaço/.). Guarda contra digitação em campos e contra
  // Espaço quando o foco está num botão ou handle dnd-kit (role=button) — Espaço lá já
  // dispara click/inicia o drag por teclado, não pode virar play/pause também.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      switch (e.key) {
        case 'k': case 'K':
          e.preventDefault(); togglePlay(); break;
        case ' ':
          if (t && (t.tagName === 'BUTTON' || t.closest('[role="button"]'))) return;
          e.preventDefault(); togglePlay(); break;
        case 'j': case 'J':
          e.preventDefault(); rewind(); break;
        case 'l': case 'L':
          e.preventDefault(); forward(); break;
        case '.':
          e.preventDefault(); stop(); break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, rewind, forward, stop]);

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
    <div className="flex flex-col border-t border-border min-h-[140px] bg-bg-deep relative">
      <div className="flex items-stretch flex-1 overflow-hidden">

        {/* ── Gutter fixo: transporte + labels (fora do eixo de tempo) ── */}
        <div className="w-32 flex-shrink-0 border-r border-border flex flex-col">
          {/* Linha alinhada com a régua: transporte + duração total */}
          <div className="h-6 border-b border-border bg-bg-deep flex items-center justify-between gap-1 px-2">
            <Transport
              isPlaying={isPlaying}
              onPlayPause={togglePlay}
              onRewind={rewind}
              onForward={forward}
              onStop={stop}
            />
            <span className="text-[8px] font-mono text-text-muted tabular-nums">{total.toFixed(1)}s</span>
          </div>
          {/* Linha alinhada com a faixa de cenas */}
          <div className="h-[80px] flex items-center px-3 border-b border-border">
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-[0.08em]">Cenas</span>
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
                <div className="flex items-stretch h-[80px] relative border-b border-border">
                  {project.timeline.map((item: TimelineItem, index: number) => {
                    const isScene = 'elements' in item;
                    const scene   = item as Scene;
                    const pause   = item as ActivePause;
                    // Número do beat ignora pausas (só cenas contam na sequência narrativa)
                    const beatNumber = project.timeline.slice(0, index + 1).filter((i) => 'elements' in i).length;

                    return (
                      <React.Fragment key={item.id}>
                        {isScene ? (
                          <SceneItem
                            scene={scene}
                            isActive={scene.id === activeSceneId}
                            beatNumber={beatNumber}
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
        <div className="flex flex-col justify-center gap-2 px-6 border-l border-border flex-shrink-0 relative">
          <button
            onClick={addScene}
            aria-label="Adicionar cena"
            data-testid="add-scene"
            className="flex items-center justify-center gap-2 rounded-md px-4 py-2 text-[11px] font-semibold tracking-[-0.01em] text-text-primary bg-bg-surface border border-border hover:border-border-strong transition-colors w-full"
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
              className="flex items-center justify-center gap-2 rounded-md px-4 py-2 text-[11px] font-semibold tracking-[-0.01em] text-text-secondary bg-bg-surface border border-border hover:border-border-strong hover:text-text-primary transition-colors w-full"
            >
              <PauseCircle size={14} />
              Pausa
            </button>
            {showPauseMenu && (
              <div
                className="absolute right-0 bg-bg-elevated border border-border rounded-md p-1 flex flex-col gap-0.5 z-50 min-w-[130px] shadow-[var(--shadow-modal)]"
                style={{ bottom: 'calc(100% + 6px)' }}
              >
                <button
                  onClick={() => { addPause('black', 3); setShowPauseMenu(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-[11px] font-mono text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded transition-colors"
                >
                  <Monitor size={12} /> Tela Preta
                </button>
                <button
                  onClick={() => { addPause('vhs', 3); setShowPauseMenu(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-[11px] font-mono text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded transition-colors"
                >
                  <Tv2 size={12} /> Ruído VHS
                </button>
                <button
                  onClick={() => { addPause('solid', 3); setShowPauseMenu(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-[11px] font-mono text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded transition-colors"
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
