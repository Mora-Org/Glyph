'use client';

import { useEffect } from 'react';
import { useProjectStore, type EditorTool } from '@/store/projectStore';
import { IconMouse, IconType, IconHand } from '@/components/glyph';

const TOOLS: { key: EditorTool; Icon: typeof IconMouse; label: string }[] = [
  { key: 'V', Icon: IconMouse, label: 'Selecionar' },
  { key: 'T', Icon: IconType, label: 'Texto' },
  { key: 'H', Icon: IconHand, label: 'Mão' },
];

function isTyping(): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
}

export default function ToolStrip() {
  const tool = useProjectStore((s) => s.tool);
  const setTool = useProjectStore((s) => s.setTool);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isTyping() || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toUpperCase();
      if (k === 'V' || k === 'T' || k === 'H') {
        setTool(k as EditorTool);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setTool]);

  return (
    <div
      className="absolute z-10 flex flex-col"
      style={{ left: 8, top: 12, gap: 2 }}
    >
      {TOOLS.map(({ key, Icon, label }) => {
        const on = tool === key;
        return (
          <button
            key={key}
            onClick={() => setTool(key)}
            title={`${label} (${key})`}
            data-testid={`tool-${key}`}
            aria-pressed={on}
            className="relative flex items-center justify-center"
            style={{
              width: 26,
              height: 26,
              borderRadius: 'var(--r-sm)',
              cursor: 'pointer',
              border: '1px solid transparent',
              background: on ? 'var(--bg-elevated)' : 'transparent',
              color: on ? 'var(--accent)' : 'var(--text-secondary)',
              transition: 'all var(--dur-instant) var(--ease-editorial)',
            }}
          >
            <Icon size={14} />
            <span
              style={{
                position: 'absolute',
                right: 2,
                bottom: 1,
                fontFamily: 'var(--font-mono)',
                fontSize: 7,
                color: on ? 'var(--accent)' : 'var(--text-muted)',
                lineHeight: 1,
              }}
            >
              {key}
            </span>
          </button>
        );
      })}
    </div>
  );
}
