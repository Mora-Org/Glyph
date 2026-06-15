'use client';

import React, { useState } from 'react';

interface AssetFile {
  name: string;
  path: string;
  type: 'image' | 'video' | 'gif';
}

interface AssetSidebarProps {
  onDragStart?: (file: AssetFile) => void;
}

const ACCEPTED = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp4', '.mov', '.webm'];

function inferType(name: string): AssetFile['type'] {
  if (name.endsWith('.gif')) return 'gif';
  if (['.mp4', '.mov', '.webm'].some((ext) => name.endsWith(ext))) return 'video';
  return 'image';
}

export default function AssetSidebar({ onDragStart }: AssetSidebarProps) {
  const [files, setFiles] = useState<AssetFile[]>([]);

  function handleFolderSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const assets: AssetFile[] = selected
      .filter((f) => ACCEPTED.some((ext) => f.name.toLowerCase().endsWith(ext)))
      .map((f) => ({
        name: f.name,
        path: URL.createObjectURL(f),
        type: inferType(f.name.toLowerCase()),
      }));
    setFiles((prev) => [...prev, ...assets]);
  }

  const icons: Record<AssetFile['type'], string> = {
    image: '🖼',
    video: '🎬',
    gif:   '✨',
  };

  return (
    <aside className="flex flex-col gap-4 h-full w-56 border-r border-white/8 px-7 py-7 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Assets</span>
        <label className="cursor-pointer flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all">
          + Pasta
          <input
            type="file"
            // @ts-expect-error — webkitdirectory não está nos tipos padrão
            webkitdirectory=""
            multiple
            accept={ACCEPTED.join(',')}
            onChange={handleFolderSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* Lista de arquivos */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1">
        {files.length === 0 && (
          <p className="text-xs text-white/20 font-mono text-center mt-8 leading-relaxed">
            Adicione uma pasta<br />para ver seus assets
          </p>
        )}

        {files.map((file) => (
          <div
            key={file.path}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/peg-asset', JSON.stringify(file));
              onDragStart?.(file);
            }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-grab
                       hover:bg-white/8 transition-colors active:cursor-grabbing"
          >
            <span className="text-base leading-none">{icons[file.type]}</span>
            <span className="text-xs text-white/70 truncate" title={file.name}>
              {file.name}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
