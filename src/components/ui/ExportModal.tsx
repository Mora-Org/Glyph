'use client';

import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';

// Quando a bridge Rust estiver pronta, substituir o mock pela integração real:
// import { listen } from '@tauri-apps/api/event';
// import { invoke } from '@tauri-apps/api/tauri';

type ExportStatus = 'idle' | 'rendering' | 'done' | 'error';

interface ExportProgressPayload {
  percentage: number;
  status: 'rendering' | 'done' | 'error';
  message?: string;
}

interface ExportModalProps {
  projectName: string;
  onClose: () => void;
}

export default function ExportModal({ projectName, onClose }: ExportModalProps) {
  const [status, setStatus]       = useState<ExportStatus>('idle');
  const [progress, setProgress]   = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError]         = useState('');
  const mockTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Limpa timer ao desmontar
  useEffect(() => {
    return () => {
      if (mockTimerRef.current) clearInterval(mockTimerRef.current);
    };
  }, []);

  function startExport() {
    setStatus('rendering');
    setProgress(0);
    setError('');

    // ── TODO: Substituir por integração Tauri real ──────────────────────────
    // invoke('export_video', { args: buildFFmpegArgs(), totalDuration: 30 });
    // const unlisten = await listen<ExportProgressPayload>('export-progress', (event) => {
    //   setProgress(event.payload.percentage);
    //   setStatusMsg(event.payload.message ?? '');
    //   if (event.payload.status === 'done')  { setStatus('done');  unlisten(); }
    //   if (event.payload.status === 'error') { setStatus('error'); setError(event.payload.message ?? 'Erro desconhecido'); unlisten(); }
    // });
    // ── Mock de progresso (remover quando Rust estiver pronto) ──────────────
    const stages = [
      'Renderizando frames...',
      'Renderizando frames...',
      'Processando overlays...',
      'Codificando vídeo...',
      'Codificando vídeo...',
      'Finalizando...',
    ];
    let step = 0;
    mockTimerRef.current = setInterval(() => {
      step++;
      const pct = Math.min(100, Math.round((step / stages.length) * 100));
      setProgress(pct);
      setStatusMsg(stages[Math.min(step - 1, stages.length - 1)]);
      if (step >= stages.length) {
        clearInterval(mockTimerRef.current!);
        setStatus('done');
        setStatusMsg('Exportação concluída!');
      }
    }, 800);
    // ───────────────────────────────────────────────────────────────────────
  }

  function handleClose() {
    if (mockTimerRef.current) clearInterval(mockTimerRef.current);
    onClose();
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
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

        {/* Configurações (só no idle) */}
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
              <span className="text-[11px] font-mono text-white/70">Auto (GPU / CPU)</span>
            </div>
          </div>
        )}

        {/* Progresso */}
        {(status === 'rendering' || status === 'done') && (
          <div className="flex flex-col gap-3">
            {/* Barra */}
            <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* % e mensagem */}
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
              <Button variant="primary" size="sm" onClick={() => {
                // TODO: invoke('open_export_folder')
                handleClose();
              }}>
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
