'use client';

import { useState } from 'react';
import SearchInput from './SearchInput';

interface FontEntry {
  name: string;
  family: string;
  weight: number;
  kind: string;
  tag: string;
}

const FONTS: FontEntry[] = [
  { name: 'Fraunces', family: 'var(--font-display)', weight: 800, kind: 'serif', tag: 'display' },
  { name: 'Geist', family: 'var(--font-sans)', weight: 500, kind: 'sans', tag: 'ui' },
  { name: 'Geist Mono', family: 'var(--font-mono)', weight: 500, kind: 'mono', tag: 'dados' },
];

export default function FontsTab() {
  const [query, setQuery] = useState('');
  const visible = FONTS.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <SearchInput value={query} onChange={setQuery} placeholder="Buscar fonte..." />
      <div className="flex flex-1 flex-col overflow-y-auto" style={{ padding: '0 8px 8px', gap: 2 }}>
        {visible.map((f) => (
          <button
            key={f.name}
            className="flex items-center"
            style={{
              gap: 10,
              padding: 8,
              cursor: 'grab',
              textAlign: 'left',
              borderRadius: 'var(--r-sm)',
              background: 'transparent',
              border: 'none',
            }}
          >
            <span
              className="flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                flexShrink: 0,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                fontFamily: f.family,
                fontWeight: f.weight,
                fontSize: 15,
                color: 'var(--text-primary)',
                fontVariationSettings: f.name === 'Fraunces' ? "'opsz' 40" : undefined,
              }}
            >
              Aa
            </span>
            <span className="flex flex-col" style={{ gap: 2, minWidth: 0 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-primary)' }}>
                {f.name}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-mono)',
                }}
              >
                {f.kind} · {f.tag}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
