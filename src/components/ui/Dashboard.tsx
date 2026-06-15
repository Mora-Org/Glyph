'use client';

import React, { useState } from 'react';
import { FolderOpen, Plus, Sparkles } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';

export default function Dashboard() {
  const createProject = useProjectStore((s) => s.createProject);
  const [name, setName]       = useState('');
  const [touched, setTouched] = useState(false);

  const isEmpty = touched && !name.trim();

  function handleCreate(e: React.SyntheticEvent) {
    e.preventDefault();
    setTouched(true);
    if (!name.trim()) return;
    createProject(name.trim());
  }

  return (
    <div className="min-h-screen bg-surface overflow-hidden relative flex flex-col items-center justify-center">

      {/* Gradiente de fundo sutil */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,255,255,0.05),transparent)]" />

      {/* By Mora — canto superior direito */}
      <p
        className="absolute top-5 right-6 text-[11px] font-mono uppercase tracking-widest select-none"
        style={{ color: '#c9a84c' }}
      >
        by Mora
      </p>

      {/* Logo */}
      <div className="mb-16 text-center select-none">
        <div className="flex items-center justify-center gap-3">
          <Sparkles size={26} className="text-white/25" />
          <h1
            className="text-8xl font-black leading-tight"
            style={{ fontFamily: "'Nunito', sans-serif", letterSpacing: '-0.02em' }}
          >
            Glyph
          </h1>
          <Sparkles size={26} className="text-white/25 scale-x-[-1]" />
        </div>
      </div>

      {/* Card */}
      <div className="w-full flex justify-center px-8">
      <form
        onSubmit={handleCreate}
        className="w-full max-w-sm flex flex-col gap-7"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1.25rem',
          padding: '2.5rem',
        }}
      >
        <div className="flex items-center gap-2">
          <FolderOpen size={16} className="text-white/40" />
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Novo Projeto</h2>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-mono text-white/35 uppercase tracking-widest">
            Nome
          </label>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setTouched(true); }}
            onBlur={() => setTouched(true)}
            placeholder="ex: Ensaio Verão 2026"
            autoFocus
            aria-required="true"
            aria-invalid={isEmpty}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${isEmpty ? 'rgba(255,80,80,0.5)' : 'rgba(255,255,255,0.10)'}`,
              borderRadius: '0.625rem',
              padding: '0.8rem 1rem',
              fontSize: '0.875rem',
              color: '#fff',
              outline: 'none',
              transition: 'border-color 150ms',
              width: '100%',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
          />
          {isEmpty && (
            <p className="text-[11px] text-red-400/80 font-mono" role="alert">
              Nome obrigatório.
            </p>
          )}
        </div>

        <button
          type="submit"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: '#ffffff',
            color: '#000000',
            border: 'none',
            borderRadius: '0.625rem',
            padding: '0.9rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'opacity 150ms, transform 100ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.92'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Plus size={16} />
          Criar Projeto
        </button>
      </form>

      </div>

      {/* Versão */}
      <p className="mt-16 text-[11px] font-mono text-white/15 tracking-widest uppercase">
        v0.6.0
      </p>
    </div>
  );
}
