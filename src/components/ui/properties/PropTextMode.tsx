'use client';

import React, { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import type { SceneElement, AnimationEffect } from '@/store/projectStore';
import type { MainCanvasHandle } from '@/components/canvas/MainCanvas';
import { Slider, NumField } from '@/components/glyph';
import { PropHeader, PropSection, PropRow } from './PropPrimitives';

const EFFECTS: { value: AnimationEffect; label: string }[] = [
  { value: 'none', label: 'Nenhum' },
  { value: 'tremor', label: 'Tremor' },
  { value: 'neon', label: 'Neon' },
  { value: 'ticker', label: 'Letreiro' },
];

interface PropTextModeProps {
  element: SceneElement;
  sceneId: string;
  canvasHandle: React.RefObject<MainCanvasHandle | null>;
}

export default function PropTextMode({ element, sceneId, canvasHandle }: PropTextModeProps) {
  const updateElement = useProjectStore((s) => s.updateElement);

  // Draft local: mantém os inputs fluidos sem persistir no localStorage a cada frame.
  // (PropertiesPanel remonta este componente via key={element.id} → init fresco por seleção.)
  const [draft, setDraft] = useState({
    x: element.transform.x,
    y: element.transform.y,
    rotation: element.transform.rotation,
    fontSize: element.fontSize ?? 72,
  });

  const live = (patch: Partial<SceneElement>) => canvasHandle.current?.applyPatch(element.id, patch);

  // Persiste no store no commit; re-aplica efeito p/ recapturar a origem se animado.
  const commitTransform = (next: Partial<typeof draft>) => {
    const merged = { ...draft, ...next };
    updateElement(sceneId, element.id, {
      transform: { ...element.transform, x: merged.x, y: merged.y, rotation: merged.rotation },
    });
    if (element.animationEffect && element.animationEffect !== 'none') {
      canvasHandle.current?.setEffect(element.id, element.animationEffect);
    }
  };
  const commitFontSize = (size: number) => {
    updateElement(sceneId, element.id, { fontSize: size });
  };

  const setEffect = (fx: AnimationEffect) => {
    updateElement(sceneId, element.id, { animationEffect: fx });
    canvasHandle.current?.setEffect(element.id, fx);
  };

  const setColor = (fill: string) => {
    live({ fill });
    updateElement(sceneId, element.id, { fill });
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <PropHeader title="Texto" sub={element.id.slice(0, 6)} />

      {/* Preview do conteúdo */}
      <div style={{ padding: '14px', borderBottom: '1px solid var(--border)' }}>
        <p
          className="truncate"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 30,
            color: element.fill ?? 'var(--text-primary)',
            fontVariationSettings: "'opsz' 30",
          }}
        >
          {element.text || '—'}
        </p>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            color: 'var(--text-muted)',
          }}
        >
          {element.fontFamily ?? 'sans-serif'} · {draft.fontSize}px
        </span>
      </div>

      <PropSection title="Transform">
        <PropRow label="X / Y">
          <NumField
            value={draft.x}
            step={1}
            width={56}
            onChange={(x) => { setDraft((d) => ({ ...d, x })); live({ transform: { x } as SceneElement['transform'] }); }}
            onCommit={() => commitTransform({})}
          />
          <NumField
            value={draft.y}
            step={1}
            width={56}
            onChange={(y) => { setDraft((d) => ({ ...d, y })); live({ transform: { y } as SceneElement['transform'] }); }}
            onCommit={() => commitTransform({})}
          />
        </PropRow>
        <PropRow label="Tamanho">
          <Slider
            value={draft.fontSize}
            min={12}
            max={300}
            step={1}
            onChange={(fontSize) => { setDraft((d) => ({ ...d, fontSize })); live({ fontSize }); }}
            onCommit={() => commitFontSize(draft.fontSize)}
          />
          <NumField
            value={draft.fontSize}
            min={12}
            max={300}
            unit="px"
            width={56}
            onChange={(fontSize) => { setDraft((d) => ({ ...d, fontSize })); live({ fontSize }); }}
            onCommit={() => commitFontSize(draft.fontSize)}
          />
        </PropRow>
        <PropRow label="Rotação">
          <Slider
            value={draft.rotation}
            min={-180}
            max={180}
            step={1}
            onChange={(rotation) => { setDraft((d) => ({ ...d, rotation })); live({ transform: { rotation } as SceneElement['transform'] }); }}
            onCommit={() => commitTransform({})}
          />
          <NumField
            value={draft.rotation}
            min={-180}
            max={180}
            unit="°"
            width={56}
            onChange={(rotation) => { setDraft((d) => ({ ...d, rotation })); live({ transform: { rotation } as SceneElement['transform'] }); }}
            onCommit={() => commitTransform({})}
          />
        </PropRow>
      </PropSection>

      <PropSection title="Tipo">
        <PropRow label="Fonte">
          <span
            className="truncate"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-primary)' }}
          >
            {element.fontFamily ?? 'sans-serif'}
          </span>
        </PropRow>
        <PropRow label="Cor">
          <input
            type="color"
            value={element.fill ?? '#ffffff'}
            onChange={(e) => setColor(e.target.value)}
            style={{
              width: 24,
              height: 22,
              padding: 0,
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--r-sm)',
              background: 'transparent',
              cursor: 'pointer',
            }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>
            {(element.fill ?? '#ffffff').toUpperCase()}
          </span>
        </PropRow>
      </PropSection>

      <PropSection title="Efeitos">
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {EFFECTS.map((fx) => {
            const on = (element.animationEffect ?? 'none') === fx.value;
            return (
              <button
                key={fx.value}
                data-testid={`effect-${fx.value}`}
                onClick={() => setEffect(fx.value)}
                style={{
                  padding: '6px 8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9.5,
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-wide)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 'var(--r-sm)',
                  border: '1px solid var(--border)',
                  background: on ? 'var(--accent)' : 'transparent',
                  color: on ? '#1A1F33' : 'var(--text-secondary)',
                  transition: 'all var(--dur-instant) var(--ease-editorial)',
                }}
              >
                {fx.label}
              </button>
            );
          })}
        </div>
      </PropSection>
    </div>
  );
}
