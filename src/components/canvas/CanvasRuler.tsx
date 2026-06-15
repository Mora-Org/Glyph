'use client';

import { useProjectStore } from '@/store/projectStore';

// Ruler básico: réguas top + left com ticks a cada 40px. Puramente visual (F4a).
export default function CanvasRuler() {
  const showRuler = useProjectStore((s) => s.showRuler);
  if (!showRuler) return null;

  const tickH = 'repeating-linear-gradient(to right, var(--border) 0 1px, transparent 1px 40px)';
  const tickV = 'repeating-linear-gradient(to bottom, var(--border) 0 1px, transparent 1px 40px)';

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      {/* Régua superior */}
      <div
        style={{
          position: 'absolute',
          top: 26,
          left: 12,
          right: 0,
          height: 12,
          backgroundImage: tickH,
          opacity: 0.5,
        }}
      />
      {/* Régua esquerda */}
      <div
        style={{
          position: 'absolute',
          top: 38,
          left: 0,
          bottom: 0,
          width: 12,
          backgroundImage: tickV,
          opacity: 0.5,
        }}
      />
    </div>
  );
}
