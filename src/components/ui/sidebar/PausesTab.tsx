'use client';

interface PauseEntry {
  type: 'black' | 'vhs' | 'static';
  label: string;
  duration: string;
  thumb: React.CSSProperties;
}

const PAUSES: PauseEntry[] = [
  {
    type: 'black',
    label: 'Tela Preta',
    duration: '2s',
    thumb: { background: '#0d1020' },
  },
  {
    type: 'vhs',
    label: 'Ruído VHS',
    duration: '2s',
    thumb: { background: 'repeating-linear-gradient(0deg, var(--border) 0 1px, transparent 1px 3px)' },
  },
  {
    type: 'static',
    label: 'Estática',
    duration: '2s',
    thumb: {
      backgroundColor: 'var(--bg-deep)',
      backgroundImage: 'radial-gradient(circle at 1px 1px, var(--text-muted) 0.5px, transparent 0)',
      backgroundSize: '3px 3px',
    },
  },
];

export default function PausesTab() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto" style={{ padding: 8, gap: 6 }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          padding: '2px 4px',
        }}
      >
        Blocos de respiro
      </span>
      {PAUSES.map((p) => (
        <button
          key={p.type}
          className="grid items-center"
          style={{
            gridTemplateColumns: '36px 1fr auto',
            gap: 10,
            padding: '10px 12px',
            cursor: 'pointer',
            textAlign: 'left',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)',
          }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--border)',
              ...p.thumb,
            }}
          />
          <span className="flex flex-col" style={{ gap: 2, minWidth: 0 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--text-primary)' }}>
              {p.label}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wide)',
              }}
            >
              Arraste pra timeline
            </span>
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-secondary)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {p.duration}
          </span>
        </button>
      ))}
    </div>
  );
}
