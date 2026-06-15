'use client';

import React from 'react';

interface SwatchProps {
  color: string;
  size?: number;
  onClick?: () => void;
  selected?: boolean;
}

export function Swatch({ color, size = 16, onClick, selected }: SwatchProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') onClick?.(); }}
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--r-sm)',
        background: color,
        border: selected
          ? '2px solid var(--text-primary)'
          : '1px solid var(--border-strong)',
        cursor: onClick ? 'pointer' : 'default',
        flexShrink: 0,
        boxShadow: selected ? `0 0 0 3px var(--accent-ring)` : undefined,
        transition: 'box-shadow 120ms var(--ease-editorial)',
      }}
    />
  );
}
