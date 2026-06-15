'use client';

import { GlyphButton, IconArrowLeft, IconType } from '@/components/glyph';

interface TopbarProps {
  projectName: string;
  lettering: boolean;
  onLettering: () => void;
  onExport: () => void;
  onBack: () => void;
}

export default function Topbar({ projectName, lettering, onLettering, onExport, onBack }: TopbarProps) {
  return (
    <header
      className="flex flex-shrink-0 items-center justify-between border-b"
      style={{ height: 'var(--layout-topbar)', padding: '0 14px', background: 'var(--bg-deep)', borderColor: 'var(--border)' }}
    >
      {/* Cluster esquerdo */}
      <div className="flex items-center" style={{ gap: 14 }}>
        <button
          onClick={onBack}
          aria-label="Voltar ao Dashboard"
          title="Voltar ao Dashboard"
          className="flex items-center"
          style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <IconArrowLeft size={14} />
        </button>

        {/* Wordmark — marca/identidade (acento isento da regra "1x por tela") */}
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--fw-black)' as unknown as number,
            fontSize: 18,
            letterSpacing: 'var(--tracking-tighter)',
            color: 'var(--text-primary)',
            fontVariationSettings: "'opsz' 28, 'SOFT' 30",
            lineHeight: 1,
          }}
        >
          Gl<span style={{ color: 'var(--accent)' }}>y</span>ph
        </span>

        <span style={{ width: 1, height: 14, background: 'var(--border)' }} />

        <span
          data-testid="topbar-project-name"
          className="truncate"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: 'var(--tracking-wide)',
            color: 'var(--text-secondary)',
            maxWidth: 240,
          }}
        >
          {projectName}
        </span>
      </div>

      {/* Cluster direito */}
      <div className="flex items-center" style={{ gap: 8 }}>
        <button
          onClick={onLettering}
          aria-pressed={lettering}
          data-testid="topbar-lettering"
          className="inline-flex items-center"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            padding: '5px 10px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)',
            gap: 6,
            cursor: 'pointer',
            letterSpacing: 'var(--tracking-wide)',
            transition: 'all var(--dur-instant) var(--ease-editorial)',
            background: lettering ? 'var(--bg-elevated)' : 'transparent',
            color: lettering ? 'var(--text-primary)' : 'var(--text-secondary)',
          }}
        >
          <IconType size={13} />
          Lettering
        </button>

        <GlyphButton variant="primary" size="sm" onClick={onExport} data-testid="topbar-export">
          Exportar
        </GlyphButton>
      </div>
    </header>
  );
}
