'use client';

import { IconSparkles } from '@/components/glyph';

interface EffectEntry {
  name: string;
  desc: string;
}

// Espelha os efeitos reais de lettering (AnimationEffect: tremor | neon | ticker).
const EFFECTS: EffectEntry[] = [
  { name: 'Tremor', desc: 'ansiedade · loop' },
  { name: 'Neon', desc: 'pisca · 0.8s' },
  { name: 'Letreiro', desc: 'ticker · scroll' },
];

export default function EffectsTab() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto" style={{ padding: 8, gap: 4 }}>
      {EFFECTS.map((fx) => (
        <button
          key={fx.name}
          className="flex items-center"
          style={{
            gap: 10,
            padding: 8,
            cursor: 'pointer',
            textAlign: 'left',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)',
          }}
        >
          <span
            className="flex items-center justify-center"
            style={{
              width: 24,
              height: 24,
              flexShrink: 0,
              background: 'var(--bg-deep)',
              borderRadius: 'var(--r-sm)',
              color: 'var(--text-secondary)',
            }}
          >
            <IconSparkles size={12} />
          </span>
          <span className="flex flex-col" style={{ gap: 2, minWidth: 0 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--text-primary)' }}>
              {fx.name}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--text-muted)',
                letterSpacing: 'var(--tracking-wide)',
              }}
            >
              {fx.desc}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
