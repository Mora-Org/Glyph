'use client';

import React, { useCallback, useRef } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { getItemStartTime, getTotalDuration } from '@/utils/timeHelpers';
import { PIXELS_PER_SECOND } from './TimelineConstants';

const SNAP_THRESHOLD = 0.1; // segundos

/**
 * Playhead: linha de reprodução vertical com scrubbing e snapping nas bordas de cenas.
 * Vive dentro da coluna de tempo (#global-timeline-area), onde x=0 = t=0.
 */
export default function Playhead() {
  const project = useProjectStore((s) => s.project!);
  const seekTo  = useProjectStore((s) => s.seekTo);

  const isDragging = useRef(false);

  const scrub = useCallback((clientX: number) => {
    const timelineEl = document.getElementById('global-timeline-area');
    if (!timelineEl) return;

    const rect  = timelineEl.getBoundingClientRect();
    const x     = clientX - rect.left + timelineEl.scrollLeft;
    const total = getTotalDuration(project.timeline);
    let   time  = Math.min(total, Math.max(0, x / PIXELS_PER_SECOND));

    // Snapping nas bordas das cenas/pausas
    for (const item of project.timeline) {
      const start = getItemStartTime(project.timeline, item.id);
      const end   = start + item.duration;
      if (Math.abs(time - start) < SNAP_THRESHOLD) { time = start; break; }
      if (Math.abs(time - end)   < SNAP_THRESHOLD) { time = end;   break; }
    }

    seekTo(time);
  }, [project.timeline, seekTo]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    scrub(e.clientX);

    function onMouseMove(ev: MouseEvent) {
      if (!isDragging.current) return;
      scrub(ev.clientX);
    }
    function onMouseUp() {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [scrub]);

  return (
    <div
      className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-[100] cursor-ew-resize select-none pointer-events-auto"
      style={{ left: project.currentTime * PIXELS_PER_SECOND }}
      onMouseDown={onMouseDown}
    >
      {/* Triângulo / handle no topo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 clip-path-triangle" />

      <style jsx>{`
        .clip-path-triangle {
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
      `}</style>
    </div>
  );
}
