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
      {/* Linha conectora */}
      <div className="w-4 h-px bg-white/15" />

      <button
        onClick={cycle}
        title={`Transição: ${labels[type]} — clique para mudar`}
        className="
          flex items-center justify-center
          px-1.5 py-0.5 rounded
          text-[9px] font-mono font-bold tracking-wider
          border transition-all
          bg-[#0a0a0a] hover:bg-white/10
          text-white/40 hover:text-white/80
          border-white/10 hover:border-white/25
        "
      >
        {labels[type]}
      </button>

      <div className="w-4 h-px bg-white/15" />
    </div>
  );
}
