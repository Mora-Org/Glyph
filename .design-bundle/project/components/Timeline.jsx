// Bottom dock — element timeline + scene list + transport
function Transport() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '4px 8px',
      background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 3,
    }}>
      {[
        { i: <IconRewind size={11} />, k: 'J' },
        { i: <IconPlay size={11} />, k: 'K', active: true },
        { i: <IconForward size={11} />, k: 'L' },
        { i: <IconStop size={11} />, k: '.' },
      ].map((t, i) => (
        <button key={i} style={{
          width: 22, height: 22,
          background: t.active ? 'var(--bg-elevated)' : 'transparent',
          color: t.active ? 'var(--accent)' : 'var(--text-secondary)',
          border: 'none', borderRadius: 2, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{t.i}</button>
      ))}
    </div>
  );
}

function ElementTimeline({ scene, playhead = 3.4 }) {
  const ticks = [];
  for (let i = 0; i <= scene.duration; i += 1) ticks.push(i);
  const phPct = (playhead / scene.duration) * 100;

  return (
    <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-deep)' }}>
      {/* Timeline header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '4px 12px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-deep)', height: 30,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-secondary)',
          letterSpacing: '0.10em', textTransform: 'uppercase',
        }}>Timeline — {scene.name} · {scene.duration}s</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-primary)',
            fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em',
          }}>{playhead.toFixed(2)}<span style={{ color: 'var(--text-muted)' }}> / {scene.duration.toFixed(2)}s</span></span>
          <Transport />
          <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>Zoom 100%</span>
        </div>
      </div>

      {/* Ruler */}
      <div style={{ display: 'flex', height: 16, borderBottom: '1px solid var(--border)', position: 'relative' }}>
        <div style={{ width: 110, flexShrink: 0, borderRight: '1px solid var(--border)' }} />
        <div style={{ flex: 1, position: 'relative' }}>
          {ticks.map((s) => (
            <div key={s} style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${(s / scene.duration) * 100}%`,
              borderLeft: '1px solid var(--border)',
              fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)',
              paddingLeft: 4, lineHeight: '16px',
              fontVariantNumeric: 'tabular-nums',
            }}>{s}s</div>
          ))}
          {/* Playhead head */}
          <div style={{
            position: 'absolute', top: 0, left: `${phPct}%`,
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)', fontSize: 8,
            background: 'var(--accent)', color: '#1A1F33',
            padding: '0 4px', borderRadius: 1, lineHeight: '14px',
            fontVariantNumeric: 'tabular-nums',
          }}>{playhead.toFixed(2)}</div>
        </div>
      </div>

      {/* Track rows */}
      <div style={{ position: 'relative' }}>
        {scene.elements.map((el) => {
          const colorMap = {
            text:  'rgba(240,231,213,0.55)',
            image: 'rgba(232,181,71,0.45)',
            video: 'rgba(200,72,92,0.45)',
            audio: 'rgba(107,138,90,0.5)',
          };
          const tagBg = {
            text: 'var(--text-primary)', image: 'var(--accent)',
            video: '#C8485C', audio: 'var(--success)',
          };
          return (
            <div key={el.id} style={{
              display: 'flex', height: 28, alignItems: 'center', borderBottom: '1px solid var(--border)',
            }}>
              <div style={{
                width: 110, flexShrink: 0, padding: '0 10px',
                display: 'flex', alignItems: 'center', gap: 6,
                borderRight: '1px solid var(--border)', height: '100%',
                background: el.selected ? 'var(--bg-surface)' : 'transparent',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 7.5, fontWeight: 700,
                  padding: '2px 4px', borderRadius: 2,
                  background: tagBg[el.type], color: '#1A1F33',
                  letterSpacing: '0.04em',
                }}>{el.type.slice(0, 3).toUpperCase()}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9.5, color: el.selected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{el.name}</span>
              </div>
              <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                <div style={{
                  position: 'absolute', top: 4, bottom: 4,
                  left: `${(el.start / scene.duration) * 100}%`,
                  width: `${((el.end - el.start) / scene.duration) * 100}%`,
                  background: el.selected ? 'rgba(232,181,71,0.7)' : colorMap[el.type],
                  borderRadius: 2,
                  outline: el.selected ? '1px solid var(--accent)' : 'none',
                  display: 'flex', alignItems: 'center',
                  paddingLeft: 6, gap: 6,
                  fontFamily: 'var(--font-mono)', fontSize: 9, color: el.selected ? '#1A1F33' : 'rgba(26,31,51,0.7)',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  overflow: 'hidden',
                }}>
                  <span style={{ fontWeight: 600 }}>{(el.end - el.start).toFixed(1)}s</span>
                </div>
              </div>
            </div>
          );
        })}
        {/* Audio tracks */}
        <div style={{
          display: 'flex', height: 28, alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(107,138,90,0.04)',
        }}>
          <div style={{
            width: 110, flexShrink: 0, padding: '0 10px',
            display: 'flex', alignItems: 'center', gap: 6,
            borderRight: '1px solid var(--border)', height: '100%',
          }}>
            <span style={{ color: 'var(--success)', display: 'flex' }}><IconMic size={10} /></span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-secondary)' }}>vo-cena2</span>
          </div>
          <div style={{ flex: 1, position: 'relative', height: '100%' }}>
            <Waveform color="rgba(107,138,90,0.5)" />
          </div>
        </div>
        <div style={{
          display: 'flex', height: 28, alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(107,138,90,0.04)',
        }}>
          <div style={{
            width: 110, flexShrink: 0, padding: '0 10px',
            display: 'flex', alignItems: 'center', gap: 6,
            borderRight: '1px solid var(--border)', height: '100%',
          }}>
            <span style={{ color: 'var(--success)', display: 'flex' }}><IconMusic size={10} /></span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-secondary)' }}>bgm-warmer</span>
          </div>
          <div style={{ flex: 1, position: 'relative', height: '100%' }}>
            <Waveform color="rgba(107,138,90,0.32)" dense />
          </div>
        </div>

        {/* Playhead vertical line */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `calc(110px + ${phPct}% * (100% - 110px) / 100%)`,
          width: 1, background: 'var(--accent)', pointerEvents: 'none', zIndex: 2,
        }} />
      </div>
    </div>
  );
}

function Waveform({ color, dense }) {
  // Procedurally generated bars
  const bars = [];
  const n = dense ? 80 : 60;
  for (let i = 0; i < n; i++) {
    const h = 30 + Math.abs(Math.sin(i * 0.7) * 50) + Math.abs(Math.sin(i * 0.27) * 20);
    bars.push(h);
  }
  return (
    <div style={{
      position: 'absolute', inset: 4, display: 'flex', alignItems: 'center', gap: 1,
    }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          flex: 1, height: `${Math.min(h, 90)}%`, background: color, borderRadius: 1,
          minWidth: 1,
        }} />
      ))}
    </div>
  );
}

function SceneCard({ scene, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      flexShrink: 0, width: 156,
      background: active ? 'var(--bg-elevated)' : 'var(--bg-surface)',
      borderLeft: active ? '2px solid var(--accent)' : '1px solid var(--border)',
      borderTop: '1px solid var(--border)', borderRight: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      borderRadius: active ? '0 6px 6px 0' : 6,
      overflow: 'hidden', cursor: 'pointer',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        height: 56, position: 'relative',
        background: '#15192A',
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 8, top: 8,
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17,
          color: scene.heroColor || 'var(--text-primary)',
          letterSpacing: '-0.04em', lineHeight: 1,
          fontStyle: scene.italic ? 'italic' : 'normal',
        }}>{scene.hero || scene.name}</div>
        <div style={{
          position: 'absolute', right: 6, bottom: 5,
          fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--text-muted)',
          letterSpacing: '0.08em',
        }}>{String(scene.idx || 1).padStart(2,'0')}</div>
      </div>
      <div style={{
        padding: '6px 10px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{scene.name}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums' }}>{scene.duration}s</div>
      </div>
    </div>
  );
}

function PauseCard({ pause }) {
  const labels = { black: '■ PRETO', vhs: '▓ VHS', static: '● ESTÁTICO' };
  const bg = pause.type === 'black' ? '#0d1020' :
             pause.type === 'vhs' ? '#1a1f33' : '#232940';
  return (
    <div style={{
      flexShrink: 0, width: 96,
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 6, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        height: 56, background: bg,
        backgroundImage: pause.type === 'vhs'
          ? 'repeating-linear-gradient(0deg, rgba(240,231,213,0.06) 0px, rgba(240,231,213,0.06) 1px, transparent 1px, transparent 4px)'
          : 'none',
        borderBottom: '1px solid var(--border)',
      }} />
      <div style={{ padding: '6px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.10em' }}>{labels[pause.type]}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{pause.duration}s</div>
      </div>
    </div>
  );
}

function TransitionBadge({ type }) {
  const sym = type === 'fade' ? '◐' : type === 'wipe' ? '◧' : '|';
  return (
    <div style={{
      flexShrink: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
      letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '2px 4px', alignSelf: 'center',
    }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1 }}>{sym}</span>
      <span style={{ fontSize: 7.5 }}>{type}</span>
    </div>
  );
}

function SceneList({ scenes, activeId, setActive }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch', minHeight: 102, background: 'var(--bg-deep)',
    }}>
      <div style={{
        flex: 1, minWidth: 0, overflowX: 'auto',
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
      }}>
        {scenes.map((item, i) => (
          <React.Fragment key={item.id}>
            {item.kind === 'scene' ? (
              <SceneCard scene={item} active={item.id === activeId} onClick={() => setActive(item.id)} />
            ) : (
              <PauseCard pause={item} />
            )}
            {i < scenes.length - 1 && item.kind === 'scene' && scenes[i+1].kind === 'scene' && (
              <TransitionBadge type={item.transition || 'cut'} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 6,
        padding: '12px 14px', borderLeft: '1px solid var(--border)',
        flexShrink: 0, minWidth: 134, justifyContent: 'center',
      }}>
        <button style={addBtn}>
          <IconClapperboard size={12} /> Cena
        </button>
        <button style={{ ...addBtn, color: 'var(--text-secondary)' }}>
          <IconPause size={12} /> Pausa
        </button>
        <button style={{ ...addBtn, color: 'var(--text-secondary)' }}>
          <IconMic size={12} /> Áudio
        </button>
      </div>
    </div>
  );
}

const addBtn = {
  display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8,
  padding: '6px 10px', width: '100%',
  fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
  background: 'var(--bg-surface)', color: 'var(--text-primary)',
  border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer',
  letterSpacing: '-0.01em',
};

window.ElementTimeline = ElementTimeline;
window.SceneList = SceneList;
