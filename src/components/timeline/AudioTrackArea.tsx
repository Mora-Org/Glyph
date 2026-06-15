'use client';

import React from 'react';
import { useProjectStore } from '@/store/projectStore';
import type { AudioElement } from '@/store/projectStore';
import { PIXELS_PER_SECOND, TRACK_HEIGHT } from './TimelineConstants';
import { Mic, Music, Trash2, Volume2, Plus } from 'lucide-react';
import Waveform from './Waveform';

const AUDIO_EXTS  = '.mp3,.wav,.ogg,.m4a,.aac,.flac';
const LANE_HEIGHT = TRACK_HEIGHT * 2;

// ── AudioBlock ────────────────────────────────────────────────────────────────

function AudioBlock({ element, trackType, onRemove, onToggleNR }: {
  element: AudioElement;
  trackType: 'vo' | 'bgm';
  onRemove: () => void;
  onToggleNR: () => void;
}) {
  // Áudio em sage contido: VO mais presente, BGM lê como textura de fundo.
  const color = trackType === 'vo'
    ? 'bg-success-soft border-success/40'
    : 'bg-success/5 border-success/20';

  const left  = element.startTime * PIXELS_PER_SECOND;
  const width = Math.max(element.duration * PIXELS_PER_SECOND, 32);
  // Densidade do waveform proporcional à largura do clipe (preview, não análise real).
  // VO lê mais presente; BGM fica como textura de fundo.
  const bars = Math.max(8, Math.min(80, Math.round(width / 5)));

  return (
    <div
      className={`absolute top-1.5 bottom-1.5 rounded-md border ${color} group/block overflow-hidden transition-all hover:brightness-110`}
      style={{ left, width }}
    >
      {/* Waveform procedural ao fundo */}
      <div
        className="absolute inset-0 px-1 py-1.5 pointer-events-none"
        style={{ opacity: trackType === 'vo' ? 0.5 : 0.28 }}
      >
        <Waveform seed={element.id} bars={bars} color="var(--success)" />
      </div>

      {/* Conteúdo sobre o waveform */}
      <div className="relative z-10 flex items-center h-full px-2 gap-1">
        <span className="text-[9px] font-mono truncate flex-1 text-text-secondary tabular-nums select-none">
          {element.src.split('/').pop() ?? `${element.duration}s`}
        </span>
        {/* Noise Reduction toggle — só visível para VO */}
        {trackType === 'vo' && (
          <button
            onClick={onToggleNR}
            title={element.noiseReduction ? 'Noise Reduction: ON' : 'Noise Reduction: OFF'}
            className={`flex-shrink-0 transition-colors ${element.noiseReduction ? 'text-success' : 'text-text-muted hover:text-text-secondary'}`}
          >
            <Volume2 size={9} />
          </button>
        )}
        <button
          onClick={onRemove}
          className="flex-shrink-0 text-text-muted hover:text-danger transition-colors opacity-0 group-hover/block:opacity-100"
        >
          <Trash2 size={9} />
        </button>
      </div>

      {/* Barra de volume */}
      <div className="absolute bottom-0 left-0 h-px bg-success/50 z-20" style={{ width: `${element.volume * 100}%` }} />
    </div>
  );
}

// ── AudioTrackLabels (coluna gutter, largura fixa) ──────────────────────────────

/**
 * Coluna de labels/controles das trilhas de áudio. Fica no gutter fixo do SceneList,
 * fora do eixo de tempo. Cada linha tem altura LANE_HEIGHT, casando com AudioTrackLanes.
 */
export function AudioTrackLabels() {
  const tracks           = useProjectStore((s) => s.project?.audioTracks ?? []);
  const addAudioTrack    = useProjectStore((s) => s.addAudioTrack);
  const removeAudioTrack = useProjectStore((s) => s.removeAudioTrack);
  const addAudioElement  = useProjectStore((s) => s.addAudioElement);

  function handleAudioFile(trackId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    addAudioElement(trackId, {
      src: URL.createObjectURL(file),
      startTime: 0,
      duration: 10,
      offset: 0,
      volume: 1,
      noiseReduction: false,
    });
    e.target.value = '';
  }

  if (tracks.length === 0) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 border-t border-border">
        <span className="text-[9px] font-mono text-text-muted uppercase tracking-[0.08em]">Áudio</span>
        <button
          onClick={() => addAudioTrack('vo')}
          data-testid="add-audio-vo"
          className="flex items-center gap-1 text-[10px] font-mono text-text-muted hover:text-success transition-colors"
        >
          <Plus size={9} /><Mic size={9} /> VO
        </button>
        <button
          onClick={() => addAudioTrack('bgm')}
          data-testid="add-audio-bgm"
          className="flex items-center gap-1 text-[10px] font-mono text-text-muted hover:text-success transition-colors"
        >
          <Plus size={9} /><Music size={9} /> BGM
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-t border-border">
      {tracks.map((track) => {
        const Icon = track.type === 'vo' ? Mic : Music;
        return (
          <div
            key={track.id}
            className="flex flex-col justify-center gap-1 px-3 border-b border-border last:border-0"
            style={{ height: LANE_HEIGHT }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Icon size={10} className="text-success" />
                <span className="text-[10px] font-mono text-text-secondary truncate max-w-[60px]">{track.name}</span>
              </div>
              <button
                onClick={() => removeAudioTrack(track.id)}
                title="Remover trilha"
                className="text-text-muted hover:text-danger transition-colors"
              >
                <Trash2 size={9} />
              </button>
            </div>
            <label className="cursor-pointer flex items-center gap-1 text-[9px] font-mono text-text-muted hover:text-text-secondary transition-colors">
              <Plus size={9} /> arquivo
              <input type="file" accept={AUDIO_EXTS} className="hidden" onChange={(e) => handleAudioFile(track.id, e)} />
            </label>
          </div>
        );
      })}

      {/* Rodapé: adicionar trilha */}
      <div className="flex items-center gap-3 px-3 py-1.5 border-t border-border">
        <span className="text-[8px] font-mono text-text-muted uppercase tracking-[0.08em]">+ trilha</span>
        <button onClick={() => addAudioTrack('vo')} className="flex items-center gap-1 text-[9px] font-mono text-text-muted hover:text-success transition-colors">
          <Mic size={8} /> VO
        </button>
        <button onClick={() => addAudioTrack('bgm')} className="flex items-center gap-1 text-[9px] font-mono text-text-muted hover:text-success transition-colors">
          <Music size={8} /> BGM
        </button>
      </div>
    </div>
  );
}

// ── AudioTrackLanes (coluna de tempo) ───────────────────────────────────────────

/**
 * Lanes de áudio renderizadas no eixo de tempo. Cada bloco é posicionado por
 * startTime × escala — alinhado em x=0 = t=0 com cenas, régua e playhead.
 */
export function AudioTrackLanes() {
  const tracks             = useProjectStore((s) => s.project?.audioTracks ?? []);
  const updateAudioElement = useProjectStore((s) => s.updateAudioElement);
  const removeAudioElement = useProjectStore((s) => s.removeAudioElement);

  if (tracks.length === 0) return null;

  return (
    <div className="flex flex-col border-t border-border">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="relative border-b border-border last:border-0"
          style={{ height: LANE_HEIGHT }}
        >
          {track.elements.map((el) => (
            <AudioBlock
              key={el.id}
              element={el}
              trackType={track.type}
              onRemove={() => removeAudioElement(track.id, el.id)}
              onToggleNR={() => updateAudioElement(track.id, el.id, { noiseReduction: !el.noiseReduction })}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
