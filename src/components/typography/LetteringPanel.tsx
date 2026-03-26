'use client';

import React, { useRef } from 'react';
import { useProjectStore } from '@/store/projectStore';
import type { Scene, SceneElement, AnimationEffect } from '@/store/projectStore';
import { splitTextToChars, createTextElement } from '@/utils/parsers/lettering';

interface LetteringPanelProps {
  scene: Scene;
  onAddText: (el: SceneElement) => void;
  onSetEffect: (elementId: string, effect: AnimationEffect) => void;
}

const EFFECTS: { value: AnimationEffect; label: string; desc: string }[] = [
  { value: 'none',   label: 'Nenhum',  desc: '' },
  { value: 'tremor', label: 'Tremor',  desc: 'Ansiedade' },
  { value: 'neon',   label: 'Neon',    desc: 'Pisca' },
  { value: 'ticker', label: 'Letreiro',desc: 'Loop' },
];

const FONTS = [
  'sans-serif', 'serif', 'monospace',
  'Georgia', 'Verdana', 'Impact', 'Arial Black',
];

export default function LetteringPanel({ scene, onAddText, onSetEffect }: LetteringPanelProps) {
  const addElement    = useProjectStore((s) => s.addElement);
  const updateElement = useProjectStore((s) => s.updateElement);
  const removeElement = useProjectStore((s) => s.removeElement);
  const offscreenRef  = useRef<HTMLCanvasElement | null>(null);

  const textElements = scene.elements.filter((el) => el.type === 'text' && !el.isLetterChar);

  function handleAddText() {
    const el = createTextElement(scene.id, {
      startTime: 0,
      endTime: scene.duration,
    });
    addElement(scene.id, el);
    onAddText(el);
  }

  function handleSplit(el: SceneElement) {
    if (!offscreenRef.current) {
      offscreenRef.current = document.createElement('canvas');
    }
    const chars = splitTextToChars(el, offscreenRef.current);
    if (!chars.length) return;

    // Remove o elemento original e adiciona os caracteres individuais
    removeElement(scene.id, el.id);
    chars.forEach((ch) => addElement(scene.id, ch));
  }

  function handleEffectChange(el: SceneElement, effect: AnimationEffect) {
    updateElement(scene.id, el.id, { animationEffect: effect });
    onSetEffect(el.id, effect);
  }

  function handleFontChange(el: SceneElement, fontFamily: string) {
    updateElement(scene.id, el.id, { fontFamily });
  }

  function handleSizeChange(el: SceneElement, fontSize: number) {
    updateElement(scene.id, el.id, { fontSize });
  }

  function handleColorChange(el: SceneElement, fill: string) {
    updateElement(scene.id, el.id, { fill });
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Lettering</span>
        <button
          onClick={handleAddText}
          className="glass-button text-xs px-2 py-1"
        >
          + Texto
        </button>
      </div>

      {textElements.length === 0 && (
        <p className="text-[10px] font-mono text-white/20 text-center mt-4 leading-relaxed">
          Adicione um texto<br />para editar
        </p>
      )}

      {/* Lista de elementos de texto */}
      {textElements.map((el) => (
        <div key={el.id} className="glass-panel p-3 flex flex-col gap-3">

          {/* Texto atual */}
          <p className="text-sm font-bold truncate" style={{ color: el.fill ?? '#fff', fontFamily: el.fontFamily }}>
            {el.text || '—'}
          </p>

          {/* Fonte */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono text-white/30 uppercase">Fonte</span>
            <select
              value={el.fontFamily ?? 'sans-serif'}
              onChange={(e) => handleFontChange(el, e.target.value)}
              className="glass rounded px-2 py-1 text-xs text-white/80 outline-none"
            >
              {FONTS.map((f) => <option key={f} value={f} style={{ background: '#111' }}>{f}</option>)}
            </select>
          </div>

          {/* Tamanho */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-white/30 uppercase w-12">Tam.</span>
            <input
              type="range" min={12} max={300} step={2}
              value={el.fontSize ?? 72}
              onChange={(e) => handleSizeChange(el, Number(e.target.value))}
              className="flex-1 accent-white h-1"
            />
            <span className="text-[10px] font-mono text-white/50 w-8 text-right">
              {el.fontSize ?? 72}
            </span>
          </div>

          {/* Cor */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-white/30 uppercase w-12">Cor</span>
            <input
              type="color"
              value={el.fill ?? '#ffffff'}
              onChange={(e) => handleColorChange(el, e.target.value)}
              className="w-8 h-6 rounded cursor-pointer border border-white/10 bg-transparent"
            />
            <span className="text-[10px] font-mono text-white/30">{el.fill ?? '#ffffff'}</span>
          </div>

          {/* Efeito */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono text-white/30 uppercase">Animação</span>
            <div className="grid grid-cols-2 gap-1">
              {EFFECTS.map((fx) => (
                <button
                  key={fx.value}
                  onClick={() => handleEffectChange(el, fx.value)}
                  className={`
                    px-2 py-1 rounded text-[10px] font-mono text-left border transition-all
                    ${el.animationEffect === fx.value
                      ? 'bg-white text-black border-white'
                      : 'glass text-white/50 border-white/10 hover:text-white'}
                  `}
                >
                  {fx.label}
                  {fx.desc && <span className="ml-1 opacity-50">· {fx.desc}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Split */}
          {!el.isLetterChar && (
            <button
              onClick={() => handleSplit(el)}
              className="glass border border-white/10 rounded px-2 py-1.5 text-[10px] font-mono text-white/50 hover:text-white hover:border-white/25 transition-all text-left"
              title="Divide em letras individuais para controle granular"
            >
              ✦ Split em letras individuais
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
