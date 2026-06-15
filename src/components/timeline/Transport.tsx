'use client';

import React from 'react';
import { SkipBack, SkipForward, Play, Pause, Square } from 'lucide-react';

interface TransportProps {
  isPlaying: boolean;
  onRewind: () => void;     // J — borda anterior / início
  onPlayPause: () => void;  // K / Espaço
  onForward: () => void;    // L — próxima borda / fim
  onStop: () => void;       // . — para e volta a 0
}

/**
 * Transporte de reprodução: 4 botões compactos que dirigem o playhead global.
 * Play ativo é o único acento amarelo do grupo (disciplina de acento por tela).
 * Os atalhos J/K/L/Espaço/. são tratados em SceneList; aqui só os títulos os anunciam.
 */
export default function Transport({ isPlaying, onRewind, onPlayPause, onForward, onStop }: TransportProps) {
  const ghost =
    'flex items-center justify-center w-[18px] h-[18px] rounded-[3px] text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors';

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Transporte">
      <button className={ghost} onClick={onRewind} title="Voltar (J)" aria-label="Voltar">
        <SkipBack size={11} />
      </button>

      <button
        onClick={onPlayPause}
        data-testid="transport-play"
        title={isPlaying ? 'Pausar (K)' : 'Reproduzir (K)'}
        aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
        className={`flex items-center justify-center w-[18px] h-[18px] rounded-[3px] transition-colors ${
          isPlaying ? 'bg-bg-elevated text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
        }`}
      >
        {isPlaying ? <Pause size={11} /> : <Play size={11} />}
      </button>

      <button className={ghost} onClick={onForward} title="Avançar (L)" aria-label="Avançar">
        <SkipForward size={11} />
      </button>

      <button className={ghost} onClick={onStop} title="Parar (.)" aria-label="Parar">
        <Square size={10} />
      </button>
    </div>
  );
}
