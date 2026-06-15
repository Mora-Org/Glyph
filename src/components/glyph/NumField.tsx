'use client';

import React, { useCallback, useRef, useState } from 'react';

interface NumFieldProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  decimals?: number;
  onChange: (value: number) => void;
  onCommit?: () => void;
  disabled?: boolean;
  width?: number | string;
}

export function NumField({
  value,
  min = -Infinity,
  max = Infinity,
  step = 1,
  unit,
  decimals = 0,
  onChange,
  onCommit,
  disabled,
  width = 60,
}: NumFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const dragRef = useRef<{ startY: number; startValue: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (editing) return;
    e.preventDefault();
    dragRef.current = { startY: e.clientY, startValue: value };

    const onMove = (me: MouseEvent) => {
      if (!dragRef.current) return;
      const delta = (dragRef.current.startY - me.clientY) * step;
      onChange(clamp(dragRef.current.startValue + delta));
    };

    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      onCommit?.();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [editing, value, step, min, max, onChange, onCommit]);

  const handleDoubleClick = () => {
    setDraft(value.toFixed(decimals));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commit = () => {
    const parsed = parseFloat(draft);
    if (!isNaN(parsed)) onChange(clamp(parsed));
    setEditing(false);
    onCommit?.();
  };

  const display = `${value.toFixed(decimals)}${unit ?? ''}`;

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width,
    height: '24px',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-sm)',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--fs-label)',
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
    cursor: disabled ? 'not-allowed' : 'ew-resize',
    userSelect: 'none',
    opacity: disabled ? 0.45 : 1,
    overflow: 'hidden',
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
        style={{
          ...containerStyle,
          cursor: 'text',
          outline: '1px solid var(--accent)',
          padding: '0 4px',
          textAlign: 'center',
        }}
        autoFocus
      />
    );
  }

  return (
    <div
      style={containerStyle}
      onMouseDown={disabled ? undefined : handleMouseDown}
      onDoubleClick={disabled ? undefined : handleDoubleClick}
      title="Arraste para ajustar · Duplo clique para editar"
    >
      {display}
    </div>
  );
}
