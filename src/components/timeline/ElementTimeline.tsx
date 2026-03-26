'use client';

import React, { useRef, useCallback } from 'react';
import { useProjectStore } from '@/store/projectStore';
import type { Scene, SceneElement } from '@/store/projectStore';

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

const typeColor: Record<SceneElement['type'], string> = {
  image: 'bg-cyan-500/70',
  video: 'bg-pink-500/70',
  gif:   'bg-yellow-400/70',
  text:  'bg-white/60',
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
    <div className="flex flex-col border-t border-white/8 bg-[#0d0d0d]" style={{ maxHeight: 160 }}>
      {/* Header da timeline */}
      <div className="flex items-center px-3 py-1 border-b border-white/5">
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
          Timeline — {scene.name} ({scene.duration}s)
        </span>
      </div>

      {/* Régua de tempo */}
      <div className="flex overflow-y-auto">
        <div style={{ width: LABEL_W, flexShrink: 0 }} />
        <div className="flex-1 relative h-4 border-b border-white/5">
          {Array.from({ length: Math.floor(scene.duration) + 1 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${(i / scene.duration) * 100}%` }}
            >
              <div className="w-px h-2 bg-white/15" />
              <span className="text-[8px] font-mono text-white/25">{i}s</span>
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
              className="flex items-center border-b border-white/5"
              style={{ height: TRACK_H }}
            >
              {/* Label do elemento */}
              <div
                className="flex items-center gap-1.5 px-2 flex-shrink-0 border-r border-white/5"
                style={{ width: LABEL_W }}
              >
                <span className={`text-[8px] font-mono font-bold px-1 py-0.5 rounded ${typeColor[el.type]} text-black`}>
                  {typeLabel[el.type]}
                </span>
                <span className="text-[9px] font-mono text-white/30 truncate">{name}</span>
              </div>

              {/* Track area */}
              <div className="flex-1 relative h-full">
                {/* Bloco do elemento */}
                <div
                  className={`absolute top-1 bottom-1 rounded ${typeColor[el.type]} opacity-80 flex items-center`}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                >
                  {/* Handle esquerdo (startTime) */}
                  <div
                    onMouseDown={(e) => dragStart(el, e)}
                    className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize flex items-center justify-center rounded-l"
                  >
                    <div className="w-0.5 h-3 bg-black/40 rounded" />
                  </div>

                  {/* Handle direito (endTime) */}
                  <div
                    onMouseDown={(e) => dragEnd(el, e)}
                    className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize flex items-center justify-center rounded-r"
                  >
                    <div className="w-0.5 h-3 bg-black/40 rounded" />
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
