'use client';

import React, { useRef, useCallback } from 'react';
import { useProjectStore } from '@/store/projectStore';
import type { Scene, SceneElement } from '@/store/projectStore';
import { TYPE_TAG_FILL, TYPE_BLOCK_FILL } from './TimelineConstants';

interface ElementTimelineProps {
  scene: Scene;
}

const TRACK_H    = 28;
const LABEL_W    = 80;
const MIN_DUR    = 0.25; // segundos mínimos por elemento

const typeLabel: Record<SceneElement['type'], string> = {
  image: 'IMG',
  video: 'VID',
  gif:   'GIF',
  text:  'TXT',
};

export default function ElementTimeline({ scene }: ElementTimelineProps) {
  const updateElement = useProjectStore((s) => s.updateElement);
  const trackAreaRef  = useRef<HTMLDivElement>(null);

  // Converte posição X no track para segundos
  function xToSeconds(x: number, trackWidth: number): number {
    return Math.max(0, Math.min(scene.duration, (x / trackWidth) * scene.duration));
  }

  // Drag do handle esquerdo (startTime)
  const dragStart = useCallback(
    (el: SceneElement, e: React.MouseEvent) => {
      e.preventDefault();
      const trackW = trackAreaRef.current?.clientWidth ?? 1;
      const startX = e.clientX;
      const origStart = el.startTime;

      function onMove(mv: MouseEvent) {
        const dx = mv.clientX - startX;
        const ds = (dx / trackW) * scene.duration;
        const newStart = Math.max(0, Math.min(el.endTime - MIN_DUR, origStart + ds));
        updateElement(scene.id, el.id, { startTime: Math.round(newStart * 100) / 100 });
      }
      function onUp() {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      }
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [scene, updateElement]
  );

  // Teclado para handle esquerdo (startTime) — lê valores frescos do store via getter
  function keyStart(el: SceneElement, e: React.KeyboardEvent) {
    const STEP = 0.1;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const fresh = useProjectStore.getState().project?.timeline
      .flatMap((i) => ('elements' in i ? (i as Scene).elements : []))
      .find((x) => x.id === el.id) ?? el;
    if (e.key === 'ArrowRight') {
      const newStart = Math.min(fresh.endTime - MIN_DUR, fresh.startTime + STEP);
      updateElement(scene.id, el.id, { startTime: Math.round(newStart * 100) / 100 });
    } else {
      const newStart = Math.max(0, fresh.startTime - STEP);
      updateElement(scene.id, el.id, { startTime: Math.round(newStart * 100) / 100 });
    }
  }

  // Teclado para handle direito (endTime) — lê valores frescos do store via getter
  function keyEnd(el: SceneElement, e: React.KeyboardEvent) {
    const STEP = 0.1;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const fresh = useProjectStore.getState().project?.timeline
      .flatMap((i) => ('elements' in i ? (i as Scene).elements : []))
      .find((x) => x.id === el.id) ?? el;
    if (e.key === 'ArrowRight') {
      const newEnd = Math.min(scene.duration, fresh.endTime + STEP);
      updateElement(scene.id, el.id, { endTime: Math.round(newEnd * 100) / 100 });
    } else {
      const newEnd = Math.max(fresh.startTime + MIN_DUR, fresh.endTime - STEP);
      updateElement(scene.id, el.id, { endTime: Math.round(newEnd * 100) / 100 });
    }
  }

  // Drag do handle direito (endTime)
  const dragEnd = useCallback(
    (el: SceneElement, e: React.MouseEvent) => {
      e.preventDefault();
      const trackW = trackAreaRef.current?.clientWidth ?? 1;
      const startX = e.clientX;
      const origEnd = el.endTime;

      function onMove(mv: MouseEvent) {
        const dx = mv.clientX - startX;
        const ds = (dx / trackW) * scene.duration;
        const newEnd = Math.max(el.startTime + MIN_DUR, Math.min(scene.duration, origEnd + ds));
        updateElement(scene.id, el.id, { endTime: Math.round(newEnd * 100) / 100 });
      }
      function onUp() {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      }
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [scene, updateElement]
  );

  if (scene.elements.length === 0) return null;

  return (
    <div className="flex flex-col border-t border-border bg-bg-deep" style={{ maxHeight: 160 }}>
      {/* Header da timeline */}
      <div className="flex items-center px-3 py-1 border-b border-border">
        <span className="text-[9.5px] font-mono text-text-secondary uppercase tracking-[0.10em]">
          Timeline — {scene.name} ({scene.duration}s)
        </span>
      </div>

      {/* Régua de tempo */}
      <div className="flex overflow-y-auto">
        <div style={{ width: LABEL_W, flexShrink: 0 }} />
        <div className="flex-1 relative h-4 border-b border-border">
          {Array.from({ length: Math.floor(scene.duration) + 1 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${(i / scene.duration) * 100}%` }}
            >
              <div className="w-px h-2 bg-border" />
              <span className="text-[8px] font-mono text-text-muted tabular-nums">{i}s</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tracks dos elementos */}
      <div className="overflow-y-auto" ref={trackAreaRef}>
        {scene.elements.map((el) => {
          const leftPct  = (el.startTime / scene.duration) * 100;
          const widthPct = ((el.endTime - el.startTime) / scene.duration) * 100;
          const name     = el.src ? el.src.split('/').pop()?.split('?')[0] ?? el.id : el.id;

          return (
            <div
              key={el.id}
              className="flex items-center border-b border-border"
              style={{ height: TRACK_H }}
            >
              {/* Label do elemento */}
              <div
                className="flex items-center gap-1.5 px-2 flex-shrink-0 border-r border-border"
                style={{ width: LABEL_W }}
              >
                <span
                  className="text-[7.5px] font-mono font-bold tracking-[0.04em] px-1 py-0.5 rounded-[2px]"
                  style={{ background: TYPE_TAG_FILL[el.type], color: '#1A1F33' }}
                >
                  {typeLabel[el.type]}
                </span>
                <span className="text-[9px] font-mono text-text-secondary truncate">{name}</span>
              </div>

              {/* Track area */}
              <div className="flex-1 relative h-full">
                {/* Bloco do elemento */}
                <div
                  className="absolute top-1 bottom-1 rounded-[2px] flex items-center"
                  style={{ left: `${leftPct}%`, width: `${widthPct}%`, background: TYPE_BLOCK_FILL[el.type] }}
                >
                  {/* Handle esquerdo (startTime) */}
                  <div
                    role="slider"
                    aria-label={`Ajustar início de ${el.id}`}
                    aria-valuenow={el.startTime}
                    aria-valuemin={0}
                    aria-valuemax={el.endTime}
                    tabIndex={0}
                    data-testid={`handle-start-${el.id}`}
                    onMouseDown={(e) => { (e.currentTarget as HTMLElement).focus(); dragStart(el, e); }}
                    onKeyDown={(e) => keyStart(el, e)}
                    className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize flex items-center justify-center rounded-l focus:outline-none focus:ring-1 focus:ring-accent"
                    title="Arrastar para ajustar início"
                  >
                    <div className="w-0.5 h-3 bg-bg-deep/70 rounded" />
                  </div>

                  {/* Handle direito (endTime) */}
                  <div
                    role="slider"
                    aria-label={`Ajustar fim de ${el.id}`}
                    aria-valuenow={el.endTime}
                    aria-valuemin={el.startTime}
                    aria-valuemax={scene.duration}
                    tabIndex={0}
                    data-testid={`handle-end-${el.id}`}
                    onMouseDown={(e) => { (e.currentTarget as HTMLElement).focus(); dragEnd(el, e); }}
                    onKeyDown={(e) => keyEnd(el, e)}
                    className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize flex items-center justify-center rounded-r focus:outline-none focus:ring-1 focus:ring-accent"
                    title="Arrastar para ajustar fim"
                  >
                    <div className="w-0.5 h-3 bg-bg-deep/70 rounded" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
