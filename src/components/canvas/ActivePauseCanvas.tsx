'use client';

import React, { useEffect, useRef } from 'react';
import type { ActivePause } from '@/store/projectStore';

interface ActivePauseCanvasProps {
  pause: ActivePause;
  width: number;
  height: number;
}

export default function ActivePauseCanvas({ pause, width, height }: ActivePauseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    cancelAnimationFrame(rafRef.current);

    if (pause.type === 'black') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      return;
    }

    if (pause.type === 'solid') {
      ctx.fillStyle = pause.color ?? '#1a1a2e';
      ctx.fillRect(0, 0, width, height);
      return;
    }

    // VHS — ruído estático animado
    function drawNoise() {
      if (!ctx || !canvas) return;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 180 | 0;
        data[i]     = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);

      // Scanlines VHS
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 2);
      }

      // Linha de glitch horizontal aleatória
      if (Math.random() > 0.85) {
        const y = Math.random() * height | 0;
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.15})`;
        ctx.fillRect(0, y, width, 1 + Math.random() * 3 | 0);
      }

      rafRef.current = requestAnimationFrame(drawNoise);
    }

    drawNoise();

    return () => cancelAnimationFrame(rafRef.current);
  }, [pause.type, pause.color, width, height]);

  return (
    <div className="relative flex items-center justify-center" style={{ width, height }}>
      <canvas ref={canvasRef} width={width} height={height} />

      {/* Label da pausa */}
      <div className="absolute bottom-4 left-4 glass px-3 py-1 rounded-lg">
        <span className="text-xs font-mono text-white/50">
          {pause.type === 'black' && 'Tela Preta'}
          {pause.type === 'vhs'   && 'Ruído VHS'}
          {pause.type === 'solid' && 'Cor Sólida'}
          {' — '}{pause.duration}s
        </span>
      </div>
    </div>
  );
}
