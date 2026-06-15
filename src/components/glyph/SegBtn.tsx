'use client';

import React from 'react';

interface SegBtnOption<T> {
  value: T;
  label: string;
}

interface SegBtnProps<T> {
  options: SegBtnOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export function SegBtn<T extends string | number>({ options, value, onChange, disabled }: SegBtnProps<T>) {
  return (
    <div style={{
      display: 'inline-flex',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)',
      padding: '2px',
      gap: '2px',
      opacity: disabled ? 0.45 : 1,
    }}>
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '3px 10px',
              height: '24px',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--fs-label)',
              fontWeight: 'var(--fw-medium)' as unknown as number,
              letterSpacing: 'var(--tracking-mono)',
              textTransform: 'uppercase',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              background: isActive ? 'var(--bg-elevated)' : 'transparent',
              border: isActive ? '1px solid var(--border)' : '1px solid transparent',
              borderRadius: 'var(--r-sm)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 120ms var(--ease-editorial)',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
