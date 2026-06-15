'use client';

import React, { useState } from 'react';

interface GlyphInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
}

export function GlyphInput({ label, error, hint, style, id, ...props }: GlyphInputProps) {
  const [focused, setFocused] = useState(false);
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '36px',
    padding: '0 10px',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--fs-body)',
    color: 'var(--text-primary)',
    background: 'var(--bg-surface)',
    border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 'var(--r-md)',
    outline: 'none',
    transition: 'border-color 120ms var(--ease-editorial)',
    boxShadow: focused && !error ? '0 0 0 2px var(--accent-soft)' : undefined,
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--fs-label)',
    fontWeight: 'var(--fw-medium)' as unknown as number,
    letterSpacing: 'var(--tracking-mono)',
    textTransform: 'uppercase' as const,
    color: 'var(--text-secondary)',
    marginBottom: '6px',
  };

  const errorStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--fs-label)',
    color: 'var(--danger)',
    marginTop: '4px',
  };

  const hintStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--fs-label)',
    color: 'var(--text-muted)',
    marginTop: '4px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && <label htmlFor={inputId} style={labelStyle}>{label}</label>}
      <input
        id={inputId}
        style={inputStyle}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        {...props}
      />
      {error && <span style={errorStyle}>{error}</span>}
      {hint && !error && <span style={hintStyle}>{hint}</span>}
    </div>
  );
}
