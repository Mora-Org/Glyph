'use client';

import React from 'react';
import { useProjectStore } from '@/store/projectStore';
import type { AudioElement } from '@/store/projectStore';
import { PIXELS_PER_SECOND, TRACK_HEIGHT } from './TimelineConstants';
import { Mic, Music, Trash2, Volume2, Plus } from 'lucide-react';

const AUDIO_EXTS  = '.mp3,.wav,.ogg,.m4a,.aac,.flac';
const LANE_HEIGHT = TRACK_HEIGHT * 2;

// ── AudioBlock ────────────────────────────────────────────────────────────────

function AudioBlock({ element, trackType, onRemove, onToggleNR }: {
  element: AudioElement;
  trackType: 'vo' | 'bgm';
  onRemove: () => void;
  onToggleNR: () => void;
}) {
  const color = trackType === 'vo'
    ? 'bg-cyan-500/20 border-cyan-500/35'
    : 'bg-pink-500/20 border-pink-500/35';

  const left  = element.startTime * PIXELS_PER_SECOND;
  const width = Math.max(element.duration * PIXELS_PER_SECOND, 32);

  return (
    <div
      className={`absolute top-1.5 bottom-1.5 rounded-md border ${color} flex items-center px-2 gap-1 group/block overflow-hidden transition-all hover:brightness-110`}
      style={{ left, width }}
    >
      <span className="text-[9px] font-mono truncate flex-1 text-white/70 select-none">
        {element.src.split('/').pop() ?? `${element.duration}s`}
      </span>
      {/* Noise Reduction toggle — só visível para VO */}
      {trackType === 'vo' && (
        <button
          onClick={onToggleNR}
          title={element.noiseReduction ? 'Noise Reduction: ON' : 'Noise Reduction: OFF'}
          className={`flex-shrink-0 transition-colors ${element.noiseReduction ? 'text-green-400/80' : 'text-white/20 hover:text-white/50'}`}
        >
          <Volume2 size={9} />
        </button>
      )}
      <button
        onClick={onRemove}
        className="flex-shrink-0 text-white/20 hover:text-red-400/70 transition-colors opacity-0 group-hover/block:opacity-100"
      >
        <Trash2 size={9} />
      </button>
      {/* Barra de volume */}
      <div className="absolute bottom-0 left-0 h-px bg-white/20" style={{ width: `${element.volume * 100}%` }} />
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
      <div className="flex items-center gap-3 px-3 py-2 border-t border-white/8">
        <span className="text-[9px] font-mono text-white/20 uppercase tracking-wider">Áudio</span>
        <button
          onClick={() => addAudioTrack('vo')}
          data-testid="add-audio-vo"
          className="flex items-center gap-1 text-[10px] font-mono text-white/30 hover:text-cyan-400/80 transition-colors"
        >
          <Plus size={9} /><Mic size={9} /> VO
        </button>
        <button
          onClick={() => addAudioTrack('bgm')}
          data-testid="add-audio-bgm"
          className="flex items-center gap-1 text-[10px] font-mono text-white/30 hover:text-pink-400/80 transition-colors"
        >
          <Plus size={9} /><Music size={9} /> BGM
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-t border-white/8">
      {tracks.map((track) => {
        const Icon      = track.type === 'vo' ? Mic : Music;
        const iconColor = track.type === 'vo' ? 'text-cyan-400/60' : 'text-pink-400/60';
        return (
          <div
            key={track.id}
            className="flex flex-col justify-center gap-1 px-3 border-b border-white/5 last:border-0"
            style={{ height: LANE_HEIGHT }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Icon size={10} className={iconColor} />
                <span className="text-[10px] font-mono text-white/60 truncate max-w-[60px]">{track.name}</span>
              </div>
              <button
                onClick={() => removeAudioTrack(track.id)}
                title="Remover trilha"
                className="text-white/20 hover:text-red-400/70 transition-colors"
              >
                <Trash2 size={9} />
              </button>
            </div>
            <label className="cursor-pointer flex items-center gap-1 text-[9px] font-mono text-white/25 hover:text-white/60 transition-colors">
              <Plus size={9} /> arquivo
              <input type="file" accept={AUDIO_EXTS} className="hidden" onChange={(e) => handleAudioFile(track.id, e)} />
            </label>
          </div>
        );
      })}

      {/* Rodapé: adicionar trilha */}
      <div className="flex items-center gap-3 px-3 py-1.5 border-t border-white/5">
        <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">+ trilha</span>
        <button onClick={() => addAudioTrack('vo')} className="flex items-center gap-1 text-[9px] font-mono text-cyan-400/40 hover:text-cyan-400/80 transition-colors">
          <Mic size={8} /> VO
        </button>
        <button onClick={() => addAudioTrack('bgm')} className="flex items-center gap-1 text-[9px] font-mono text-pink-400/40 hover:text-pink-400/80 transition-colors">
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
    <div className="flex flex-col border-t border-white/8">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="relative border-b border-white/5 last:border-0"
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
