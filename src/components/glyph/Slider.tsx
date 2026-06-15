'use client';

import React from 'react';

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  onCommit?: () => void;
  disabled?: boolean;
}

export function Slider({ value, min = 0, max = 100, step = 1, onChange, onCommit, disabled }: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ position: 'relative', height: '16px', display: 'flex', alignItems: 'center', flex: 1 }}>
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '2px',
        background: 'var(--border)',
        borderRadius: '1px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${percent}%`,
          background: 'var(--accent)',
          transition: 'width 60ms linear',
        }} />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        onMouseUp={onCommit}
        onTouchEnd={onCommit}
        onKeyUp={onCommit}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
          margin: 0,
        }}
      />
      <div style={{
        position: 'absolute',
        left: `calc(${percent}% - 4px)`,
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'var(--accent)',
        pointerEvents: 'none',
        boxShadow: '0 0 0 2px var(--bg-deep)',
        transition: 'left 60ms linear',
      }} />
    </div>
  );
}
