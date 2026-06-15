'use client';

export interface Tab {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export default function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div
      role="tablist"
      className="grid border-b"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)`, borderColor: 'var(--border)' }}
    >
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={on}
            data-testid={`tab-${t.id}`}
            onClick={() => onChange(t.id)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9.5,
              padding: '8px 4px',
              background: 'transparent',
              border: 'none',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: -1,
              cursor: 'pointer',
              transition: 'color var(--dur-instant) var(--ease-editorial)',
              color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: `1px solid ${on ? 'var(--accent)' : 'transparent'}`,
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
