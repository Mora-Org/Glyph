'use client';

import React, { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import Button from './Button';
import Input from './Input';

export default function Dashboard() {
  const createProject = useProjectStore((s) => s.createProject);
  const [name, setName]       = useState('');
  const [touched, setTouched] = useState(false);

  const isEmpty = touched && !name.trim();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!name.trim()) return;
    createProject(name.trim());
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface p-8">
      {/* Logo */}
      <div className="mb-12 text-center">
        <h1 className="text-7xl font-black tracking-tighter leading-none">PEG</h1>
        <p className="mt-3 text-sm font-mono text-white/40 uppercase tracking-widest">
          Gerador de Ensaios Visuais
        </p>
      </div>

      {/* Card de criação */}
      <form
        onSubmit={handleCreate}
        className="glass-panel w-full max-w-md p-8 flex flex-col gap-6"
      >
        <h2 className="text-lg font-semibold">Novo Projeto</h2>

        <div className="flex flex-col gap-1">
          <Input
            label="Nome do projeto"
            placeholder="ex: Ensaio Verão 2026"
            value={name}
            onChange={(e) => { setName(e.target.value); setTouched(true); }}
            onBlur={() => setTouched(true)}
            autoFocus
            aria-required="true"
            aria-invalid={isEmpty}
          />
          {isEmpty && (
            <p className="text-xs text-red-400 font-mono" role="alert">
              O nome do projeto é obrigatório.
            </p>
          )}
        </div>

        <Button variant="primary" size="lg" type="submit">
          Criar Projeto
        </Button>
      </form>

      {/* Rodapé de versão */}
      <p className="mt-8 text-xs font-mono text-white/20">v0.1.0 — MVP</p>
    </div>
  );
}
