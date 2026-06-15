// Sidebar — assets library with tabs (Mídia · Tipografia · Efeitos · Pausas)
const MOCK_ASSETS = [
  { name: 'capa-verao.png',    type: 'image', size: '2.1 MB' },
  { name: 'timelapse.mp4',     type: 'video', size: '14.0 MB' },
  { name: 'glitch.gif',        type: 'gif',   size: '820 KB' },
  { name: 'paper-texture.jpg', type: 'image', size: '1.4 MB' },
  { name: 'noise.mp4',         type: 'video', size: '6.2 MB' },
  { name: 'fragmento.png',     type: 'image', size: '980 KB' },
  { name: 'archive-001.png',   type: 'image', size: '512 KB' },
];

const MOCK_FONTS = [
  { name: 'Fraunces', kind: 'Variable', tag: 'DISPLAY' },
  { name: 'Geist', kind: 'Variable', tag: 'UI' },
  { name: 'Geist Mono', kind: 'Variable', tag: 'DATA' },
  { name: 'Departure Mono', kind: 'TTF', tag: 'IMP' },
  { name: 'Editorial New', kind: 'OTF', tag: 'IMP' },
  { name: 'Söhne Breit', kind: 'WOFF2', tag: 'IMP' },
];

const MOCK_EFFECTS = [
  { name: 'Tremor de Ansiedade', desc: '0.8s · loop' },
  { name: 'Neon Flicker',         desc: '1.2s · loop' },
  { name: 'Vibration',            desc: '0.4s · loop' },
  { name: 'Letreiro Antigo',      desc: '2.0s · once' },
  { name: 'Glitch Vertical',      desc: '0.6s · loop' },
];

const MOCK_PAUSES = [
  { type: 'black',  label: 'Tela Preta',  glyph: '■', dur: '2s' },
  { type: 'vhs',    label: 'Ruído VHS',   glyph: '▓', dur: '3s' },
  { type: 'static', label: 'Estático',    glyph: '●', dur: '1.5s' },
];

function TabBar({ active, onChange, tabs }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
      borderBottom: '1px solid var(--border)',
    }}>
      {tabs.map((t) => {
        const on = active === t;
        return (
          <button key={t} onClick={() => onChange(t)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 9.5,
            padding: '8px 4px',
            background: 'transparent',
            color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: on ? '1px solid var(--accent)' : '1px solid transparent',
            marginBottom: -1,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'color 120ms',
          }}>{t}</button>
        );
      })}
    </div>
  );
}

function SearchInput({ placeholder }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 10px', margin: '8px 8px 6px',
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 4,
    }}>
      <span style={{ color: 'var(--text-muted)', display: 'flex' }}><IconSearch size={11} /></span>
      <input placeholder={placeholder} style={{
        flex: 1, background: 'transparent', border: 'none', outline: 'none',
        fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-primary)',
        letterSpacing: '0.04em',
      }} />
    </div>
  );
}

function MediaTab({ activeAsset, onPick }) {
  const iconFor = (t) =>
    t === 'image' ? <IconImage /> : t === 'video' ? <IconFilm /> : <IconSparkles />;
  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 10px 6px',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>7 itens</div>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontFamily: 'var(--font-mono)', fontSize: 9.5, padding: '3px 7px',
          background: 'transparent', color: 'var(--text-secondary)',
          border: '1px solid var(--border)', borderRadius: 3, cursor: 'pointer',
          letterSpacing: '0.04em',
        }}>
          <IconFolder size={10} /> Pasta
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 6px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {MOCK_ASSETS.map((a, i) => {
          const active = activeAsset === a.name;
          return (
            <button
              key={i}
              onClick={() => onPick && onPick(a)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: active ? '6px 8px 6px 6px' : '6px 8px',
                background: active ? 'var(--bg-elevated)' : 'transparent',
                borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                borderRadius: active ? '0 4px 4px 0' : 4,
                cursor: 'grab', textAlign: 'left',
                color: 'var(--text-secondary)',
                transition: 'background 120ms',
                border: 'none',
              }}
            >
              <span style={{ color: active ? 'var(--accent)' : 'var(--text-secondary)', flexShrink: 0 }}>
                {iconFor(a.type)}
              </span>
              <span style={{
                flex: 1, minWidth: 0, fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--text-primary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{a.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>{a.size}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function FontsTab() {
  return (
    <>
      <SearchInput placeholder="Buscar fonte..." />
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {MOCK_FONTS.map((f, i) => {
          const fam = f.name === 'Geist Mono' ? 'var(--font-mono)' :
                      f.name === 'Fraunces' ? 'var(--font-display)' :
                      'var(--font-sans)';
          return (
            <button key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 8px',
              background: 'transparent',
              border: 'none', borderRadius: 4,
              cursor: 'grab', textAlign: 'left',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 3, flexShrink: 0,
                background: 'var(--bg-surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: fam, fontSize: 16, color: 'var(--text-primary)',
                fontWeight: f.name === 'Fraunces' ? 800 : 500,
                fontVariationSettings: f.name === 'Fraunces' ? "'opsz' 144" : 'normal',
              }}>Aa</div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{
                  fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                }}>{f.name}</div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>{f.kind} · {f.tag}</div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function EffectsTab() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {MOCK_EFFECTS.map((e, i) => {
        const accent = i === 0;
        return (
          <button key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)', borderRadius: 4,
            cursor: 'grab', textAlign: 'left',
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 3, flexShrink: 0,
              background: 'var(--bg-deep)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: accent ? 'var(--accent)' : 'var(--text-secondary)',
            }}><IconSparkles size={12} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
              }}>{e.name}</div>
              <div style={{
                marginTop: 2, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
                letterSpacing: '0.04em',
              }}>{e.desc}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function PausesTab() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
        letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 4px 4px',
      }}>Blocos de respiro</div>
      {MOCK_PAUSES.map((p, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 10, alignItems: 'center',
          padding: '10px 12px',
          background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 4,
          cursor: 'grab',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 3,
            background: p.type === 'black' ? '#0d1020' : p.type === 'vhs' ? '#1a1f33' : '#232940',
            backgroundImage: p.type === 'vhs'
              ? 'repeating-linear-gradient(0deg, rgba(240,231,213,0.08) 0px, rgba(240,231,213,0.08) 1px, transparent 1px, transparent 3px)'
              : p.type === 'static'
              ? 'radial-gradient(circle at 30% 20%, rgba(240,231,213,0.15) 0.5px, transparent 1px), radial-gradient(circle at 70% 60%, rgba(240,231,213,0.12) 0.5px, transparent 1px), radial-gradient(circle at 40% 80%, rgba(240,231,213,0.18) 0.5px, transparent 1px)'
              : 'none',
            backgroundSize: p.type === 'static' ? '8px 8px' : 'auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
          }}>{p.glyph}</div>
          <div>
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}>{p.label}</div>
            <div style={{
              marginTop: 2, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>Arraste pra timeline</div>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)',
          }}>{p.dur}</span>
        </div>
      ))}
    </div>
  );
}

function Sidebar({ activeAsset, onPick }) {
  const [tab, setTab] = React.useState('Mídia');
  return (
    <aside style={{
      width: 224, flexShrink: 0,
      borderRight: '1px solid var(--border)', background: 'var(--bg-deep)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <TabBar active={tab} onChange={setTab} tabs={['Mídia', 'Tipos', 'Efeitos', 'Pausas']} />
      {tab === 'Mídia'    && <MediaTab activeAsset={activeAsset} onPick={onPick} />}
      {tab === 'Tipos'    && <FontsTab />}
      {tab === 'Efeitos'  && <EffectsTab />}
      {tab === 'Pausas'   && <PausesTab />}
    </aside>
  );
}

window.Sidebar = Sidebar;
