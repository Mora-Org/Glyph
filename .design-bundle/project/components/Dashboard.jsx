// Dashboard — projects grid, splash, empty state
const MOCK_PROJECTS = [
  { name: 'Ensaio Verão 2026', mod: '2 dias atrás', dur: '00:48', scenes: 12, hero: 'Respiro', accent: false, italic: false },
  { name: 'Manifesto Mora',    mod: 'ontem',        dur: '02:14', scenes: 8,  hero: 'Profundidade', accent: true, italic: true },
  { name: 'Abertura Podcast',  mod: '5 dias atrás', dur: '00:12', scenes: 3,  hero: 'Câmara', accent: false, italic: false },
  { name: 'Texto p/ IG',       mod: '1 sem',        dur: '00:30', scenes: 5,  hero: 'Eco', accent: false, italic: true },
  { name: 'Tipografia 01',     mod: '2 sem',        dur: '00:22', scenes: 4,  hero: 'Agora', accent: true, italic: false },
];

function ProjectCard({ p, onOpen }) {
  return (
    <button onClick={onOpen} style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 6, overflow: 'hidden', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', textAlign: 'left',
      padding: 0, color: 'inherit',
    }}>
      <div style={{
        position: 'relative', aspectRatio: '16 / 9',
        background: '#15192A',
        borderBottom: '1px solid var(--border)', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: '7%', top: '28%',
          fontFamily: 'var(--font-display)', fontWeight: p.accent ? 700 : 900,
          fontSize: 'clamp(28px, 4.4vw, 56px)',
          color: p.accent ? 'var(--accent)' : 'var(--text-primary)',
          letterSpacing: '-0.05em', lineHeight: 0.9,
          fontStyle: p.italic ? 'italic' : 'normal',
          fontVariationSettings: p.italic ? "'opsz' 144, 'SOFT' 80, 'WONK' 1" : "'opsz' 144, 'SOFT' 30",
        }}>{p.hero}</div>
        <div style={{
          position: 'absolute', right: 10, bottom: 8,
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>{p.dur}</div>
        {/* paper texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(240,231,213,0.04) 1px, transparent 0)',
          backgroundSize: '12px 12px', pointerEvents: 'none',
        }} />
      </div>
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
          color: 'var(--text-primary)', letterSpacing: '-0.01em',
        }}>{p.name}</div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)',
          letterSpacing: '0.04em',
        }}>
          <span>{p.mod}</span>
          <span>{p.scenes} cenas</span>
        </div>
      </div>
    </button>
  );
}

function NewProjectCard({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', border: '1px dashed var(--border)',
      borderRadius: 6, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 12, padding: 0, color: 'inherit',
      aspectRatio: '16 / 11.5',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--accent-soft)', color: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><IconPlus size={16} /></div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)',
        letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>Novo Projeto</div>
    </button>
  );
}

function Dashboard({ onOpen, onNew, empty = false }) {
  return (
    <div style={{
      height: '100%', width: '100%', display: 'flex',
      background: 'var(--bg-deep)', overflow: 'hidden',
    }}>
      {/* Left rail */}
      <aside style={{
        width: 200, flexShrink: 0,
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        padding: '20px 16px',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 26,
          color: 'var(--text-primary)', letterSpacing: '-0.04em',
          fontVariationSettings: "'opsz' 144, 'SOFT' 30",
        }}>
          Gl<span style={{ color: 'var(--accent)' }}>y</span>ph
        </div>
        <div style={{
          marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>by Mora</div>

        <nav style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            { label: 'Projetos', active: true },
            { label: 'Importar' },
            { label: 'Configurações' },
            { label: 'Sobre' },
          ].map((n) => (
            <button key={n.label} style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              padding: '7px 10px',
              background: n.active ? 'var(--bg-surface)' : 'transparent',
              borderLeft: n.active ? '2px solid var(--accent)' : '2px solid transparent',
              color: n.active ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: 'none', borderRadius: n.active ? '0 4px 4px 0' : 4,
              cursor: 'pointer', textAlign: 'left',
              letterSpacing: '0.04em',
            }}>{n.label}</button>
          ))}
        </nav>

        <div style={{ flex: 1 }} />
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
          letterSpacing: '0.10em', textTransform: 'uppercase',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div>v0.6.0 · Core</div>
          <div style={{ color: 'var(--text-muted)', opacity: 0.7 }}>Obsidian em breve</div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          padding: '32px 36px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>Projetos · {empty ? '0' : MOCK_PROJECTS.length}</div>
            <div style={{
              marginTop: 8,
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 48,
              color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1,
              fontVariationSettings: "'opsz' 144, 'SOFT' 30",
            }}>O respiro<br /><span style={{ fontStyle: 'italic', color: 'var(--accent)', fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}>do ensaio visual.</span></div>
          </div>
          <GlyphButton variant="primary" size="md" onClick={onNew}>+ Novo Projeto</GlyphButton>
        </div>

        {empty ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 18, padding: 40, textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36,
              color: 'var(--text-secondary)', letterSpacing: '-0.04em', lineHeight: 1.05,
              fontStyle: 'italic', maxWidth: 480,
              fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1",
            }}>Comece pelo silêncio.<br />A primeira cena vem depois.</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
              letterSpacing: '0.12em', textTransform: 'uppercase', maxWidth: 440,
            }}>Você ainda não criou nenhum projeto. Crie o primeiro abaixo ou importe uma pasta.</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <GlyphButton variant="primary" size="md" onClick={onNew}>+ Novo Projeto</GlyphButton>
              <GlyphButton variant="secondary" size="md">Importar Pasta</GlyphButton>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 36px 36px' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16,
            }}>
              <NewProjectCard onClick={onNew} />
              {MOCK_PROJECTS.map((p, i) => <ProjectCard key={i} p={p} onOpen={onOpen} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

window.Dashboard = Dashboard;
