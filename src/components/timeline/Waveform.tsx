'use client';

import React, { useMemo } from 'react';

const MAX_BARS = 80; // teto de performance — waveform é preview, não análise real

// Hash estável a partir de uma string (id/src) → semente determinística.
// Mantém a mesma forma de onda entre re-renders e reloads, sem Math.random.
function seedFrom(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

interface WaveformProps {
  /** id/src do elemento — a semente que fixa a forma de onda */
  seed: string;
  /** densidade de barras (limitada a MAX_BARS) */
  bars?: number;
  /** cor das barras (default: currentColor) */
  color?: string;
  className?: string;
}

/**
 * Waveform procedural: barras centradas verticalmente cujo envelope vem de uma
 * soma de senos semeada pelo id. É preview — a análise real do buffer virá numa
 * fase futura (fora do redesign). Memoizada por (seed, n) para não recalcular.
 */
export default function Waveform({ seed, bars = 56, color = 'currentColor', className }: WaveformProps) {
  const n = Math.min(Math.max(bars, 1), MAX_BARS);

  const heights = useMemo(() => {
    const s = seedFrom(seed);
    return Array.from({ length: n }, (_, i) => {
      const a = Math.sin((i + s) * 0.5) * 0.5 + 0.5;
      const b = Math.sin(i * 0.27 + (s % 7)) * 0.3;
      const c = Math.sin(i * 1.3 + (s % 13)) * 0.18;
      const v = Math.abs(a + b + c);
      return Math.max(0.12, Math.min(1, v));
    });
  }, [seed, n]);

  return (
    <div
      className={`flex items-center gap-px h-full w-full overflow-hidden ${className ?? ''}`}
      aria-hidden="true"
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className="flex-1 rounded-[0.5px]"
          style={{ height: `${(h * 100).toFixed(1)}%`, background: color, minWidth: 1 }}
        />
      ))}
    </div>
  );
}
