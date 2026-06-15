'use client';

import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  const trackStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    width: '26px',
    height: '14px',
    borderRadius: 'var(--r-pill)',
    background: checked ? 'var(--accent)' : 'var(--border)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background 120ms var(--ease-editorial)',
    flexShrink: 0,
  };

  const knobStyle: React.CSSProperties = {
    position: 'absolute',
    left: checked ? '14px' : '2px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: checked ? '#1A1F33' : 'var(--text-muted)',
    transition: 'left 120ms var(--ease-editorial)',
  };

  const wrapperStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--fs-body-sm)',
    color: 'var(--text-secondary)',
  };

  return (
    <label style={wrapperStyle}>
      <div
        style={trackStyle}
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); !disabled && onChange(!checked); } }}
      >
        <div style={knobStyle} />
      </div>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}
