'use client';

import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import { useProjectStore } from '@/store/projectStore';
import type { Scene } from '@/store/projectStore';

type ExportStatus = 'idle' | 'rendering' | 'done' | 'error';

interface ExportProgressPayload {
  percentage: number;
  status:     'rendering' | 'done' | 'error';
  message?:   string;
}

interface ExportModalProps {
  projectName: string;
  onClose:     () => void;
}

// Detecta se está rodando dentro do Tauri
const isTauri = () => typeof window !== 'undefined' && '__TAURI__' in window;

// Pasta temporária para frames (dentro do dir de dados do app)
const FRAMES_DIR = 'peg_export_frames';
const BATCH_SIZE = 30; // frames por batch enviado ao Rust

export default function ExportModal({ projectName, onClose }: ExportModalProps) {
  const project = useProjectStore((s) => s.project!);

  const [status, setStatus]       = useState<ExportStatus>('idle');
  const [progress, setProgress]   = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError]         = useState('');
  const [encoder, setEncoder]     = useState('Auto (GPU / CPU)');
  const unlistenRef = useRef<(() => void) | null>(null);
  const mockTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detecta o encoder disponível ao abrir o modal
  useEffect(() => {
    if (!isTauri()) return;
    import('@tauri-apps/api/core').then(({ invoke }) => {
      invoke<string>('detect_gpu_encoder').then((enc) => setEncoder(enc));
    });
  }, []);

  // Limpa listeners e timers ao desmontar
  useEffect(() => {
    return () => {
      unlistenRef.current?.();
      if (mockTimerRef.current) clearInterval(mockTimerRef.current);
    };
  }, []);

  async function startExport() {
    setStatus('rendering');
    setProgress(0);
    setError('');
    setStatusMsg('Iniciando...');

    if (isTauri()) {
      await startTauriExport();
    } else {
      runMockExport();
    }
  }

  // ── Exportação real via Tauri ─────────────────────────────────────────────

  async function startTauriExport() {
    try {
      const { invoke }        = await import('@tauri-apps/api/core');
      const { listen }        = await import('@tauri-apps/api/event');
      const { exportProjectFrames } = await import('@/utils/ffmpeg/frameExporter');
      const { buildFFmpegArgs }     = await import('@/utils/ffmpeg/ffmpegBuilder');

      // 1. Detecta encoder
      const selectedEncoder = await invoke<string>('detect_gpu_encoder') as
        'h264_nvenc' | 'h264_amf' | 'h264_qsv' | 'libx264';

      // 2. Escuta eventos de progresso do FFmpeg
      const unlisten = await listen<ExportProgressPayload>('export-progress', (event) => {
        const { percentage, status: s, message } = event.payload;
        setProgress(Math.round(percentage));
        if (s === 'rendering') setStatusMsg(message ?? 'Codificando vídeo...');
        if (s === 'done')  { setStatus('done');  setStatusMsg('Exportação concluída!'); unlisten(); }
        if (s === 'error') { setStatus('error'); setError(message ?? 'Erro na exportação.'); unlisten(); }
      });
      unlistenRef.current = unlisten;

      // 3. Renderiza frames no canvas offscreen
      setStatusMsg('Renderizando frames...');
      const scenes = project.timeline.filter((i): i is Scene => 'elements' in i);
      const exportResult = await exportProjectFrames(scenes, project.audioTracks, (ratio) => {
        setProgress(Math.round(ratio * 50)); // primeiros 50% = renderização
        setStatusMsg(`Renderizando frames... ${Math.round(ratio * 100)}%`);
      });

      // 4. Envia frames ao Rust em batches
      setStatusMsg('Gravando frames no disco...');
      const allFrames = exportResult.scenes.flatMap((s) => s.frames);
      for (let i = 0; i < allFrames.length; i += BATCH_SIZE) {
        const batch = allFrames.slice(i, i + BATCH_SIZE).map((f) => ({
          index:    f.index,
          data_url: f.dataUrl,
        }));
        await invoke('write_frames', { framesDir: FRAMES_DIR, frames: batch });
        setProgress(50 + Math.round(((i + batch.length) / allFrames.length) * 10));
      }

      // 5. Monta e dispara o comando FFmpeg
      setStatusMsg('Codificando vídeo...');
      const outputPath = `${FRAMES_DIR}/output.mp4`;
      const { args } = buildFFmpegArgs(exportResult, {
        framesDir: FRAMES_DIR,
        outputPath,
        encoder:   selectedEncoder,
      });

      await invoke('export_video', {
        args,
        totalDuration: exportResult.totalDuration,
      });

      // 6. Limpeza de frames temporários
      await invoke('cleanup_frames', { framesDir: FRAMES_DIR });

    } catch (e) {
      setStatus('error');
      setError(String(e));
    }
  }

  // ── Mock de progresso (browser dev sem Tauri) ─────────────────────────────

  function runMockExport() {
    const stages = [
      'Renderizando frames...',
      'Renderizando frames...',
      'Gravando frames no disco...',
      'Codificando vídeo...',
      'Codificando vídeo...',
      'Finalizando...',
    ];
    let step = 0;
    mockTimerRef.current = setInterval(() => {
      step++;
      setProgress(Math.min(100, Math.round((step / stages.length) * 100)));
      setStatusMsg(stages[Math.min(step - 1, stages.length - 1)]);
      if (step >= stages.length) {
        clearInterval(mockTimerRef.current!);
        setStatus('done');
        setStatusMsg('Exportação concluída! (simulação)');
      }
    }, 800);
  }

  function handleClose() {
    unlistenRef.current?.();
    if (mockTimerRef.current) clearInterval(mockTimerRef.current);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget && status !== 'rendering') handleClose(); }}
    >
      <div className="glass-panel border border-white/10 rounded-2xl w-[440px] p-6 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-tight">Exportar Projeto</h2>
            <p className="text-[11px] font-mono text-white/30 mt-0.5 truncate max-w-[320px]">
              {projectName}
            </p>
          </div>
          {status !== 'rendering' && (
            <button
              onClick={handleClose}
              className="text-white/30 hover:text-white transition-colors text-lg leading-none mt-0.5"
              aria-label="Fechar"
            >
              ✕
            </button>
          )}
        </div>

        {/* Configurações (idle) */}
        {status === 'idle' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-2 border-t border-white/5">
              <span className="text-[11px] font-mono text-white/40">Formato</span>
              <span className="text-[11px] font-mono text-white/70">MP4 (H.264)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-white/5">
              <span className="text-[11px] font-mono text-white/40">Resolução</span>
              <span className="text-[11px] font-mono text-white/70">1280 × 720</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-white/5">
              <span className="text-[11px] font-mono text-white/40">Frame Rate</span>
              <span className="text-[11px] font-mono text-white/70">30 fps</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-white/5 border-b border-white/5">
              <span className="text-[11px] font-mono text-white/40">Aceleração</span>
              <span className="text-[11px] font-mono text-white/70">{encoder}</span>
            </div>
          </div>
        )}

        {/* Progresso */}
        {(status === 'rendering' || status === 'done') && (
          <div className="flex flex-col gap-3">
            <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-white/40">{statusMsg}</span>
              <span className="text-[11px] font-mono text-white/60 tabular-nums">{progress}%</span>
            </div>
          </div>
        )}

        {/* Erro */}
        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            <p className="text-[11px] font-mono text-red-400">{error || 'Ocorreu um erro durante a exportação.'}</p>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center justify-end gap-2 pt-1">
          {status === 'idle' && (
            <>
              <Button variant="ghost" size="sm" onClick={handleClose}>Cancelar</Button>
              <Button variant="primary" size="sm" onClick={startExport}>
                Iniciar Exportação
              </Button>
            </>
          )}

          {status === 'rendering' && (
            <span className="text-[11px] font-mono text-white/30 animate-pulse">
              Renderizando...
            </span>
          )}

          {status === 'done' && (
            <>
              <Button variant="ghost" size="sm" onClick={handleClose}>Fechar</Button>
              <Button variant="primary" size="sm" onClick={handleClose}>
                Abrir Pasta
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <Button variant="ghost" size="sm" onClick={handleClose}>Fechar</Button>
              <Button variant="ghost" size="sm" onClick={() => { setStatus('idle'); setProgress(0); }}>
                Tentar Novamente
              </Button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
