'use client';

import { IconSearch } from '@/components/glyph';

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Buscar...' }: SearchInputProps) {
  return (
    <div
      className="flex items-center"
      style={{
        gap: 6,
        padding: '6px 10px',
        margin: '8px 8px 6px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-sm)',
      }}
    >
      <IconSearch size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          minWidth: 0,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--text-primary)',
          letterSpacing: 'var(--tracking-wide)',
        }}
      />
    </div>
  );
}
