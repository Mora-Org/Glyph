'use client';

import React from 'react';
import { IconImage, IconFilm, IconSparkles, IconFolder } from '@/components/glyph';

export interface AssetFile {
  name: string;
  path: string;
  type: 'image' | 'video' | 'gif';
}

const TYPE_ICON = {
  image: IconImage,
  video: IconFilm,
  gif: IconSparkles,
} as const;

interface MediaTabProps {
  files: AssetFile[];
  activeId: string | null;
  onSelect: (path: string) => void;
  onFolderSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept: string;
}

export default function MediaTab({ files, activeId, onSelect, onFolderSelect, accept }: MediaTabProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between" style={{ padding: '8px 10px 6px' }}>
        <span
          className="glyph-label-sm"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.12em' }}
        >
          {files.length} {files.length === 1 ? 'item' : 'itens'}
        </span>
        <label
          className="flex cursor-pointer items-center"
          data-testid="media-folder-picker"
          style={{
            gap: 5,
            padding: '3px 7px',
            fontFamily: 'var(--font-mono)',
            fontSize: 9.5,
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)',
          }}
        >
          <IconFolder size={10} />
          Pasta
          <input
            type="file"
            // @ts-expect-error — webkitdirectory não está nos tipos padrão
            webkitdirectory=""
            multiple
            accept={accept}
            onChange={onFolderSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* Lista */}
      <div className="flex flex-1 flex-col overflow-y-auto" style={{ padding: '0 6px 8px', gap: 1 }}>
        {files.length === 0 && (
          <p
            className="glyph-mono"
            style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 28, lineHeight: 1.6, fontSize: 10 }}
          >
            Adicione uma pasta
            <br />
            para ver seus assets
          </p>
        )}

        {files.map((file) => {
          const on = file.path === activeId;
          const TypeIcon = TYPE_ICON[file.type];
          return (
            <button
              key={file.path}
              draggable
              data-testid="media-item"
              onClick={() => onSelect(file.path)}
              onDragStart={(e) => {
                e.dataTransfer.setData('application/peg-asset', JSON.stringify(file));
              }}
              className="flex items-center"
              style={{
                gap: 8,
                padding: on ? '6px 8px 6px 6px' : '6px 8px',
                cursor: 'grab',
                textAlign: 'left',
                background: on ? 'var(--bg-elevated)' : 'transparent',
                borderLeft: `2px solid ${on ? 'var(--accent)' : 'transparent'}`,
                borderRadius: on ? '0 4px 4px 0' : 'var(--r-sm)',
                transition: 'background var(--dur-instant) var(--ease-editorial)',
              }}
            >
              <TypeIcon size={13} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
              <span
                className="truncate"
                title={file.name}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-primary)' }}
              >
                {file.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
