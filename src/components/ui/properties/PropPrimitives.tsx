'use client';

import React from 'react';

export function PropHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div
      className="flex items-baseline justify-between"
      style={{ padding: '12px 14px 10px', borderBottom: '1px solid var(--border)' }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-mono)',
          color: 'var(--text-primary)',
        }}
      >
        {title}
      </span>
      {sub && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            color: 'var(--text-muted)',
          }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

export function PropSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
      <span
        style={{
          display: 'block',
          marginBottom: 10,
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
        }}
      >
        {title}
      </span>
      <div className="flex flex-col" style={{ gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

export function PropRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center" style={{ gap: 10 }}>
      <span
        style={{
          width: 64,
          flexShrink: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wide)',
          color: 'var(--text-secondary)',
        }}
      >
        {label}
      </span>
      <div className="flex flex-1 items-center justify-end" style={{ gap: 8, minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}
