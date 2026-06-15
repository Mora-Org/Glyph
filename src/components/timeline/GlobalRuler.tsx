'use client';

import React from 'react';
import { useProjectStore } from '@/store/projectStore';
import { getTotalDuration } from '@/utils/timeHelpers';
import { PIXELS_PER_SECOND } from './TimelineConstants';

/**
 * GlobalRuler: régua de tempo da coluna de tempo. Largura = duração total × escala,
 * alinhada em x=0 = t=0 com as cenas, lanes de áudio e playhead.
 */
export default function GlobalRuler() {
  const project = useProjectStore((s) => s.project!);
  const total   = getTotalDuration(project.timeline);

  return (
    <div className="relative h-6 border-b border-border bg-bg-deep overflow-hidden select-none" style={{ width: total * PIXELS_PER_SECOND }}>
      {Array.from({ length: Math.ceil(total) + 1 }, (_, i) => (
        <div
          key={i}
          className="absolute bottom-0 flex flex-col items-center"
          style={{ left: i * PIXELS_PER_SECOND }}
        >
          {/* Marcador maior para segundos cheios */}
          <div className="w-px h-3 bg-border-strong" />
          <span className="text-[8px] font-mono text-text-muted tracking-[0.08em] tabular-nums mt-0.5">{i}s</span>

          {/* Marcador menor para meio segundo */}
          {i < total && (
            <div
              className="absolute bottom-3 w-px h-1.5 bg-border"
              style={{ left: PIXELS_PER_SECOND / 2 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
