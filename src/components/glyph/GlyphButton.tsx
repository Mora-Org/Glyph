'use client';

import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface GlyphButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

const baseStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  fontFamily: 'var(--font-sans)',
  fontWeight: 'var(--fw-medium)' as unknown as number,
  letterSpacing: 'var(--tracking-tight)',
  borderRadius: 'var(--r-md)',
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'all 120ms var(--ease-editorial)',
  whiteSpace: 'nowrap' as const,
  userSelect: 'none' as const,
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { fontSize: 'var(--fs-body-sm)', padding: '4px 10px', height: '26px' },
  md: { fontSize: 'var(--fs-body)', padding: '6px 14px', height: '32px' },
  lg: { fontSize: 'var(--fs-h2)', padding: '8px 20px', height: '40px' },
};

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'var(--accent)',
    color: '#1A1F33',
    borderColor: 'var(--accent)',
  },
  secondary: {
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    borderColor: 'var(--border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    borderColor: 'transparent',
  },
  danger: {
    background: 'var(--danger-soft)',
    color: 'var(--danger)',
    borderColor: 'var(--danger)',
  },
};

export function GlyphButton({
  variant = 'secondary',
  size = 'md',
  children,
  style,
  disabled,
  ...props
}: GlyphButtonProps) {
  const combinedStyle: React.CSSProperties = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...(disabled ? { opacity: 0.45, cursor: 'not-allowed' } : {}),
    ...style,
  };

  return (
    <button style={combinedStyle} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
