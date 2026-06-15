'use client';

import React, { useState } from 'react';
import type { TransitionType } from '@/store/projectStore';

interface TransitionBadgeProps {
  type: TransitionType;
  onChange: (t: TransitionType) => void;
}

const labels: Record<TransitionType, string> = {
  cut:  'CUT',
  fade: 'FADE',
};

export default function TransitionBadge({ type, onChange }: TransitionBadgeProps) {
  const [open, setOpen] = useState(false);

  function cycle() {
    onChange(type === 'cut' ? 'fade' : 'cut');
    setOpen(false);
  }

  return (
    <div className="relative flex items-center">
      {/* Linha conectora — hairline, é junção e não beat */}
      <div className="w-4 h-px bg-border" />

      <button
        onClick={cycle}
        title={`Transição: ${labels[type]} — clique para mudar`}
        className="
          flex items-center justify-center
          px-2.5 py-1 rounded-full
          font-mono uppercase text-[8px] tracking-[0.08em] tabular-nums
          bg-bg-surface text-text-secondary
          border border-border hover:border-border-strong hover:text-text-primary
          transition-colors
        "
      >
        {labels[type]}
      </button>

      <div className="w-4 h-px bg-border" />
    </div>
  );
}
