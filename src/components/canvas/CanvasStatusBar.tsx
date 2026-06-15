'use client';

import { useProjectStore } from '@/store/projectStore';
import type { Scene } from '@/store/projectStore';

interface CanvasStatusBarProps {
  scene: Scene;
  index: number; // 1-based
  total: number;
}

function Dot() {
  return <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>·</span>;
}

export default function CanvasStatusBar({ scene, index, total }: CanvasStatusBarProps) {
  const selectedElementId = useProjectStore((s) => s.selectedElementId);
  const selected = scene.elements.find((el) => el.id === selectedElementId);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div
      className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between"
      style={{
        height: 26,
        padding: '0 14px 0 50px',
        borderBottom: '1px solid var(--border)',
        background: 'color-mix(in srgb, var(--bg-deep) 70%, transparent)',
        backdropFilter: 'blur(8px)',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-secondary)',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: 'var(--tracking-wide)',
        pointerEvents: 'none',
      }}
    >
      <div className="flex items-center">
        <span style={{ color: 'var(--text-primary)' }}>{pad(index)}</span>
        <span style={{ color: 'var(--text-muted)' }}> / {pad(total)}</span>
        <Dot />
        <span>{scene.name}</span>
        <Dot />
        <span>1280 × 720</span>
        <Dot />
        <span>{scene.duration}s</span>
      </div>

      <div className="flex items-center">
        {selected ? (
          <>
            <span>X {Math.round(selected.transform.x)}</span>
            <Dot />
            <span>Y {Math.round(selected.transform.y)}</span>
          </>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>{scene.elements.length} elem.</span>
        )}
        <span
          style={{
            marginLeft: 12,
            padding: '1px 6px',
            borderRadius: 'var(--r-sm)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontSize: 8.5,
            textTransform: 'uppercase',
          }}
        >
          Snap
        </span>
      </div>
    </div>
  );
}
