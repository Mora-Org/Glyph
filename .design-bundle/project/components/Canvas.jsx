// Canvas mock — 16:9 with placeholder lettering composition + selection chrome
function Canvas({ scene, ruler = true, sceneIndex = 2, totalScenes = 5, tool = 'V' }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#15192A', overflow: 'hidden', position: 'relative',
      borderBottom: '1px solid var(--border)',
    }}>
      {/* Tool strip on left edge */}
      <div style={{
        position: 'absolute', left: 8, top: 12, zIndex: 3,
        display: 'flex', flexDirection: 'column', gap: 2,
        background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 4,
        padding: 3,
      }}>
        {[
          { k: 'V', icon: <IconMouse size={13} /> },
          { k: 'T', icon: <IconType size={13} /> },
          { k: 'H', icon: <IconHand size={13} /> },
        ].map((t) => {
          const active = tool === t.k;
          return (
            <div key={t.k} title={t.k} style={{
              width: 26, height: 26, borderRadius: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: active ? 'var(--bg-elevated)' : 'transparent',
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer', position: 'relative',
            }}>
              {t.icon}
              <span style={{
                position: 'absolute', right: 2, bottom: 1,
                fontFamily: 'var(--font-mono)', fontSize: 7,
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                letterSpacing: '0.04em',
              }}>{t.k}</span>
            </div>
          );
        })}
      </div>

      {/* Top status bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 14px 6px 50px',
        borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)',
        letterSpacing: '0.04em', height: 26, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ color: 'var(--text-muted)' }}>{String(sceneIndex).padStart(2,'0')} / {String(totalScenes).padStart(2,'0')}</span>
          <span style={{ color: 'var(--text-primary)' }}>{scene.name}</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span>1280 × 720</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span>{scene.duration}s</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ color: 'var(--text-muted)' }}>X 320 · Y 180</span>
          <span style={{ color: 'var(--text-muted)' }}>Z 78%</span>
          <span style={{
            background: 'var(--accent-soft)', color: 'var(--accent)',
            padding: '1px 6px', borderRadius: 2, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>Snap</span>
        </div>
      </div>

      <div style={{
        flex: 1, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 28, paddingLeft: 50,
      }}>
        {/* Optional ruler */}
        {ruler && (
          <>
            <div style={{
              position: 'absolute', left: 50, right: 28, top: 30, height: 12,
              background: 'transparent',
              backgroundImage: 'linear-gradient(to right, var(--border) 1px, transparent 1px)',
              backgroundSize: '40px 100%',
              borderBottom: '1px solid var(--border)',
            }} />
            <div style={{
              position: 'absolute', top: 30, bottom: 28, left: 50, width: 12,
              backgroundImage: 'linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
              backgroundSize: '100% 40px',
              borderRight: '1px solid var(--border)',
            }} />
          </>
        )}

        <div style={{
          position: 'relative',
          aspectRatio: '16 / 9', width: '100%', maxWidth: 720,
          background: '#1A1F33',
          border: '1px solid var(--border)',
          boxShadow: '0 24px 64px -24px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}>
          {/* paper texture grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(240,231,213,0.04) 1px, transparent 0)',
            backgroundSize: '14px 14px',
          }} />

          {/* Hero lettering */}
          <div style={{
            position: 'absolute', left: '7%', top: '20%',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px, 8.5vw, 88px)',
            color: 'var(--text-primary)', letterSpacing: '-0.05em', lineHeight: 0.9,
            fontVariationSettings: "'opsz' 144, 'SOFT' 30",
          }}>
            Respiro
          </div>
          <div style={{
            position: 'absolute', left: '13%', top: '44%',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(36px, 8.5vw, 88px)',
            color: 'var(--accent)', letterSpacing: '-0.05em', lineHeight: 0.9, fontStyle: 'italic',
            fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1",
          }}>
            do ensaio
          </div>

          {/* Mono caption */}
          <div style={{
            position: 'absolute', right: 14, bottom: 12,
            fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            {scene.name} · {scene.duration}s · 1280 × 720
          </div>

          {/* Selection chrome */}
          <div style={{
            position: 'absolute', left: '6%', top: '19%', width: '54%', height: '20%',
            border: '1px dashed var(--accent)', pointerEvents: 'none',
          }}>
            {[[0,0],[1,0],[0,1],[1,1]].map(([x, y]) => (
              <div key={`${x}-${y}`} style={{
                position: 'absolute',
                left: x ? '100%' : 0, top: y ? '100%' : 0,
                width: 6, height: 6, marginLeft: -3, marginTop: -3,
                background: 'var(--accent)',
              }} />
            ))}
          </div>

          {/* Scene index marker (bottom-left) */}
          <div style={{
            position: 'absolute', left: 14, top: 12,
            fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            CENA {String(sceneIndex).padStart(2,'0')}
          </div>
        </div>
      </div>
    </div>
  );
}

// Empty canvas state - "drag an asset" message
function EmptyCanvas({ scene }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#15192A', overflow: 'hidden', position: 'relative',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 14px',
        borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)',
        letterSpacing: '0.04em', height: 26, flexShrink: 0,
      }}>
        <span>03 / 05 · {scene.name} · 1280 × 720 · {scene.duration}s</span>
        <span style={{ color: 'var(--text-muted)' }}>vazio</span>
      </div>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 28,
      }}>
        <div style={{
          position: 'relative',
          aspectRatio: '16 / 9', width: '100%', maxWidth: 720,
          background: '#1A1F33',
          border: '1px dashed var(--border)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 16,
        }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36,
            color: 'var(--text-secondary)', letterSpacing: '-0.04em',
            opacity: 0.55, fontStyle: 'italic',
            fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1",
          }}>
            Cena em branco.
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            Arraste um asset · ou pressione T para escrever
          </div>
        </div>
      </div>
    </div>
  );
}

window.Canvas = Canvas;
window.EmptyCanvas = EmptyCanvas;
