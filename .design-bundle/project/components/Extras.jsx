// Toasts, ContextMenu, Splash, ProjectCardHover, DragGhost+DropZone,
// SettingsInlineEdit, AboutSection
// All as static components for design review (no real timers).

// ─── TOAST ──────────────────────────────────────────────────────────
function Toast({ variant = 'success', title, body, action, dismissable = true }) {
  const config = {
    success: { color: 'var(--success)', icon: <IconCheck size={14} />, label: 'Sucesso' },
    error:   { color: 'var(--danger)',  icon: <IconAlert size={14} />, label: 'Erro' },
    info:    { color: 'var(--accent)',  icon: <IconInfo size={14} />,  label: 'Aviso' },
    progress:{ color: 'var(--accent)',  icon: <IconFilm size={14} />,  label: 'Progresso' },
  }[variant];

  return (
    <div style={{
      width: 360, background: 'var(--bg-elevated)',
      border: '1px solid var(--border)', borderRadius: 6,
      boxShadow: '0 12px 32px -8px rgba(0,0,0,0.55)',
      display: 'flex', overflow: 'hidden',
    }}>
      <div style={{ width: 3, background: config.color, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: config.color,
          }}>
            {config.icon}
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9.5,
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>{config.label}</span>
          </div>
          {dismissable && (
            <button style={{
              background: 'transparent', border: 'none', color: 'var(--text-muted)',
              padding: 0, cursor: 'pointer', display: 'flex',
            }}><IconClose size={12} /></button>
          )}
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
          color: 'var(--text-primary)', letterSpacing: '-0.01em',
        }}>{title}</div>
        {body && <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)',
          lineHeight: 1.45,
        }}>{body}</div>}
        {action && (
          <div style={{ marginTop: 6, display: 'flex', gap: 12 }}>
            {action.map((a, i) => (
              <button key={i} style={{
                background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 10,
                color: a.primary ? 'var(--accent)' : 'var(--text-secondary)',
                letterSpacing: '0.10em', textTransform: 'uppercase',
                textDecoration: 'underline', textDecorationColor: 'transparent',
              }}>{a.label}</button>
            ))}
          </div>
        )}
        {variant === 'progress' && (
          <div style={{ marginTop: 8, height: 2, background: 'var(--border)', borderRadius: 1, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '64%', background: config.color }} />
          </div>
        )}
      </div>
    </div>
  );
}

function ToastStack({ children, position = 'br' }) {
  const pos = {
    br: { right: 16, bottom: 16 },
    bl: { left: 16, bottom: 16 },
    tr: { right: 16, top: 16 },
  }[position];
  return (
    <div style={{
      position: 'absolute', ...pos, zIndex: 60,
      display: 'flex', flexDirection: 'column-reverse', gap: 8,
      pointerEvents: 'none',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

// ─── CONTEXT MENU ───────────────────────────────────────────────────
function ContextMenu({ x = 0, y = 0, items, label }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, zIndex: 70,
      minWidth: 220, background: 'var(--bg-elevated)',
      border: '1px solid var(--border)', borderRadius: 5,
      boxShadow: '0 12px 32px -8px rgba(0,0,0,0.6)',
      padding: '4px 0',
    }}>
      {label && (
        <div style={{
          padding: '6px 12px 4px',
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          borderBottom: '1px solid var(--border)', marginBottom: 4,
        }}>{label}</div>
      )}
      {items.map((it, i) => {
        if (it.separator) return <div key={i} style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />;
        const danger = it.danger;
        const active = it.hover;
        return (
          <button key={i} disabled={it.disabled} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '6px 12px',
            background: active ? 'var(--bg-surface)' : 'transparent',
            border: 'none', cursor: it.disabled ? 'default' : 'pointer',
            color: it.disabled ? 'var(--text-muted)' : (danger ? 'var(--danger)' : 'var(--text-primary)'),
            opacity: it.disabled ? 0.5 : 1,
            fontFamily: 'var(--font-sans)', fontSize: 12,
            letterSpacing: '-0.005em', textAlign: 'left',
          }}>
            <span style={{ width: 14, display: 'flex', color: danger ? 'var(--danger)' : 'var(--text-secondary)' }}>
              {it.icon}
            </span>
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.shortcut && <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)',
              letterSpacing: '0.06em',
            }}>{it.shortcut}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ─── SPLASH / BOOT LOADER ───────────────────────────────────────────
function Splash({ phase = 'engine' }) {
  const phases = [
    { id: 'window',  label: 'Janela Tauri' },
    { id: 'fs',      label: 'Sistema de arquivos' },
    { id: 'engine',  label: 'VOID Engine' },
    { id: 'ffmpeg',  label: 'FFmpeg / NVENC' },
    { id: 'ui',      label: 'Interface' },
  ];
  const idx = phases.findIndex(p => p.id === phase);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--bg-deep)', color: 'var(--text-primary)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 36, position: 'relative', overflow: 'hidden',
    }}>
      {/* paper texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(240,231,213,0.03) 1px, transparent 0)',
        backgroundSize: '14px 14px', pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', position: 'relative' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 96,
          letterSpacing: '-0.05em', lineHeight: 0.9,
          color: 'var(--text-primary)',
          fontVariationSettings: "'opsz' 144, 'SOFT' 30",
        }}>
          Gl<span style={{ color: 'var(--accent)' }}>y</span>ph
        </div>
        <div style={{
          marginTop: 8,
          fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600, fontSize: 22,
          letterSpacing: '-0.03em', color: 'var(--text-secondary)',
          fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1",
        }}>respiro do ensaio visual</div>
      </div>

      <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          height: 1, background: 'var(--border)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${((idx + 1) / phases.length) * 100}%`,
            background: 'var(--accent)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9.5,
            color: 'var(--text-secondary)',
            letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>{phases[idx]?.label}</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9.5,
            color: 'var(--text-muted)',
            letterSpacing: '0.10em', textTransform: 'uppercase',
            fontVariantNumeric: 'tabular-nums',
          }}>{idx + 1} / {phases.length}</span>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
        letterSpacing: '0.18em', textTransform: 'uppercase',
      }}>v0.6.0 · Core · by Mora</div>
    </div>
  );
}

// ─── PROJECT CARD HOVER ─────────────────────────────────────────────
function ProjectCardHover({ p }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--accent)',
      borderRadius: 6, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 8px 24px -8px rgba(0,0,0,0.5), 0 0 0 3px rgba(232,181,71,0.12)',
      transform: 'translateY(-2px)', transition: 'all 120ms ease',
      position: 'relative',
    }}>
      <div style={{
        position: 'relative', aspectRatio: '16 / 9',
        background: '#15192A', borderBottom: '1px solid var(--accent)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(13,16,32,0.0) 40%, rgba(13,16,32,0.7) 100%)',
        }} />
        <div style={{
          position: 'absolute', left: '7%', top: '28%',
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(28px, 4.4vw, 56px)',
          color: 'var(--text-primary)',
          letterSpacing: '-0.05em', lineHeight: 0.9,
          fontVariationSettings: "'opsz' 144, 'SOFT' 30",
        }}>{p.hero}</div>

        {/* Hover affordances */}
        <div style={{
          position: 'absolute', left: 12, bottom: 10,
          display: 'flex', gap: 6,
        }}>
          <button style={{
            background: 'var(--accent)', color: '#1A1F33',
            border: 'none', padding: '6px 12px', borderRadius: 3,
            fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}><IconPlay size={10} /> Abrir</button>
          <button style={{
            background: 'rgba(13,16,32,0.6)', color: 'var(--text-primary)',
            border: '1px solid var(--border)', padding: '6px 9px', borderRadius: 3,
            fontFamily: 'var(--font-mono)', fontSize: 9.5,
            letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(4px)',
          }}><IconCopy size={10} /></button>
        </div>
        <button style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(13,16,32,0.6)', color: 'var(--text-secondary)',
          border: '1px solid var(--border)', borderRadius: 3,
          width: 22, height: 22, padding: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}>···</button>
      </div>
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
          color: 'var(--accent)', letterSpacing: '-0.01em',
        }}>{p.name}</div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)',
          letterSpacing: '0.04em',
        }}>
          <span>{p.mod}</span>
          <span>{p.scenes} cenas · {p.dur}</span>
        </div>
      </div>
    </div>
  );
}

// ─── DRAG GHOST + DROP ZONE ─────────────────────────────────────────
function DragGhostAndDrop({ asset = 'capa-verao.jpg', mode = 'over-canvas' }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Mock canvas */}
      <div style={{
        position: 'absolute', inset: 30,
        background: '#15192A', border: '1px solid var(--border)', borderRadius: 4,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: '8%', top: '32%',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px, 6vw, 80px)',
          color: 'rgba(240,231,213,0.18)', letterSpacing: '-0.05em', lineHeight: 0.9,
          fontVariationSettings: "'opsz' 144, 'SOFT' 30",
        }}>Respiro</div>

        {/* Dashed drop zone over canvas */}
        {mode === 'over-canvas' && (
          <>
            <div style={{
              position: 'absolute', inset: 12,
              border: '1.5px dashed var(--accent)', borderRadius: 4,
              background: 'rgba(232,181,71,0.06)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--accent)', letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>
              <IconPlus size={20} />
              <span>Soltar para adicionar à cena</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 9, letterSpacing: '0.10em' }}>
                Cena 02 · 0:00 → 0:08
              </span>
            </div>
          </>
        )}

        {/* Insertion line on timeline overlap */}
        {mode === 'timeline' && (
          <div style={{
            position: 'absolute', left: '32%', top: '70%', bottom: '8%',
            width: 2, background: 'var(--accent)',
            boxShadow: '0 0 0 1px rgba(232,181,71,0.25)',
          }}>
            <div style={{
              position: 'absolute', top: -10, left: -3, width: 8, height: 8,
              background: 'var(--accent)', borderRadius: '50%',
            }} />
          </div>
        )}
      </div>

      {/* Drag ghost — semi-transparent thumbnail tracking cursor */}
      <div style={{
        position: 'absolute', left: '54%', top: '38%',
        transform: 'rotate(-2deg)', pointerEvents: 'none',
        opacity: 0.92,
        boxShadow: '0 12px 28px -10px rgba(0,0,0,0.7)',
      }}>
        <div style={{
          width: 150, background: 'var(--bg-elevated)',
          border: '1px solid var(--accent)', borderRadius: 4,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{
            aspectRatio: '4 / 3',
            background: 'linear-gradient(135deg, #5a4a2e, #2a2418)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 8,
              border: '1px solid rgba(240,231,213,0.15)',
            }} />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 8px',
          }}>
            <span style={{ color: 'var(--accent)', display: 'flex' }}><IconImage size={11} /></span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-primary)',
              letterSpacing: '0.04em', whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{asset}</span>
          </div>
        </div>
        {/* count badge */}
        <div style={{
          position: 'absolute', top: -6, right: -6,
          background: 'var(--accent)', color: '#1A1F33',
          width: 18, height: 18, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
          boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
        }}>1</div>
      </div>

      {/* Cursor hint */}
      <div style={{
        position: 'absolute', left: '52%', top: '36%',
        color: 'var(--text-primary)',
        textShadow: '0 1px 2px rgba(0,0,0,0.6)',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1">
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3Z" />
        </svg>
      </div>
    </div>
  );
}

// ─── SETTINGS INLINE EDIT ───────────────────────────────────────────
function SettingsInlineEditPath() {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--accent)',
      borderRadius: 6,
    }}>
      <div style={{
        padding: '10px 16px', borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>FFmpeg · editando</span>
        <span style={{ color: 'var(--text-muted)' }}>Esc para cancelar</span>
      </div>
      <div style={{
        padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-primary)',
            letterSpacing: '-0.01em', marginBottom: 6,
          }}>Caminho do binário</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input value="/usr/local/bin/ffmpeg" onChange={() => {}} style={{
              flex: 1, padding: '8px 10px',
              background: 'var(--bg-deep)', border: '1px solid var(--accent)',
              borderRadius: 3, color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)', fontSize: 11.5,
              outline: 'none', letterSpacing: '0.02em',
            }} />
            <button style={{
              padding: '8px 12px', background: 'var(--bg-deep)',
              border: '1px solid var(--border)', borderRadius: 3,
              color: 'var(--text-secondary)', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.10em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 6,
            }}><IconFolder size={11} /> Procurar</button>
          </div>
          <div style={{
            marginTop: 6, display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--success)',
            letterSpacing: '0.04em',
          }}>
            <IconCheck size={11} /> Detectado: ffmpeg 6.1.1 · NVENC disponível
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 8,
          paddingTop: 8, borderTop: '1px solid var(--border)',
        }}>
          <GlyphButton variant="ghost" size="sm">Cancelar</GlyphButton>
          <GlyphButton variant="primary" size="sm">Salvar</GlyphButton>
        </div>
      </div>
    </div>
  );
}

function SettingsInlineEditColor() {
  const swatches = ['#E8B547', '#D9684A', '#7BA882', '#A892D6', '#E07A8E', '#5DA0C2'];
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--accent)',
      borderRadius: 6,
    }}>
      <div style={{
        padding: '10px 16px', borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)',
        letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>Cor de acento · editando</div>
      <div style={{
        padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {swatches.map((c, i) => (
            <button key={c} style={{
              width: 32, height: 32, borderRadius: '50%',
              background: c, border: i === 0 ? '2px solid var(--text-primary)' : '1px solid var(--border)',
              cursor: 'pointer', position: 'relative',
              boxShadow: i === 0 ? '0 0 0 3px rgba(232,181,71,0.25)' : 'none',
            }}>
              {i === 0 && <span style={{
                position: 'absolute', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#1A1F33',
              }}><IconCheck size={14} /></span>}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
            letterSpacing: '0.10em', textTransform: 'uppercase', minWidth: 40,
          }}>HEX</span>
          <input value="#E8B547" onChange={() => {}} style={{
            flex: 1, padding: '7px 10px',
            background: 'var(--bg-deep)', border: '1px solid var(--border)',
            borderRadius: 3, color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)', fontSize: 11.5,
            outline: 'none', letterSpacing: '0.04em',
          }} />
        </div>
        <div style={{
          padding: 10, borderRadius: 3, background: 'var(--bg-deep)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
            color: 'var(--text-primary)', letterSpacing: '-0.03em',
            fontVariationSettings: "'opsz' 144, 'SOFT' 30",
          }}>Pre<span style={{
            color: '#E8B547', fontStyle: 'italic',
            fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1",
          }}>view</span></span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 8,
          paddingTop: 8, borderTop: '1px solid var(--border)',
        }}>
          <GlyphButton variant="ghost" size="sm">Cancelar</GlyphButton>
          <GlyphButton variant="primary" size="sm">Aplicar</GlyphButton>
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT (within Settings) ────────────────────────────────────────
function AboutScreen({ onBack }) {
  return (
    <div style={{
      height: '100%', width: '100%', display: 'flex',
      background: 'var(--bg-deep)', overflow: 'hidden',
    }}>
      <aside style={{
        width: 200, flexShrink: 0,
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        padding: '20px 16px',
      }}>
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          background: 'transparent', border: 'none', color: 'var(--text-secondary)',
          letterSpacing: '0.10em', textTransform: 'uppercase',
          padding: '6px 0', cursor: 'pointer',
        }}>
          <IconArrowLeft size={11} /> Voltar
        </button>
        <div style={{
          marginTop: 24,
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22,
          color: 'var(--text-primary)', letterSpacing: '-0.04em',
          fontVariationSettings: "'opsz' 144, 'SOFT' 30",
        }}>Configurações</div>
        <nav style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {['Aparência', 'FFmpeg', 'Pastas padrão', 'Atalhos'].map((g) => (
            <button key={g} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10.5,
              padding: '6px 10px', background: 'transparent',
              borderLeft: '2px solid transparent',
              color: 'var(--text-secondary)', border: 'none',
              cursor: 'pointer', textAlign: 'left', letterSpacing: '0.06em',
            }}>{g}</button>
          ))}
          <button style={{
            fontFamily: 'var(--font-mono)', fontSize: 10.5,
            padding: '6px 10px',
            background: 'var(--bg-surface)',
            borderLeft: '2px solid var(--accent)',
            color: 'var(--text-primary)', border: 'none',
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer', textAlign: 'left', letterSpacing: '0.06em',
          }}>Sobre</button>
        </nav>
        <div style={{ flex: 1 }} />
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
          letterSpacing: '0.10em', textTransform: 'uppercase',
        }}>v0.6.0 · Core</div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        {/* Hero */}
        <section style={{
          padding: '48px 56px',
          borderBottom: '1px solid var(--border)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(240,231,213,0.025) 1px, transparent 0)',
            backgroundSize: '14px 14px',
          }} />
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
            letterSpacing: '0.18em', textTransform: 'uppercase', position: 'relative',
          }}>Sobre · v0.6.0 — Glyph Core</div>
          <h1 style={{
            marginTop: 14, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 64,
            color: 'var(--text-primary)', letterSpacing: '-0.05em', lineHeight: 0.95,
            fontVariationSettings: "'opsz' 144, 'SOFT' 30",
            position: 'relative', maxWidth: 720,
          }}>O <span style={{ color: 'var(--accent)' }}>respiro</span> entre o<br />
          <span style={{
            fontStyle: 'italic',
            fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1",
            color: 'var(--text-secondary)',
          }}>frame e o sentido.</span></h1>
        </section>

        {/* Two-column: pillars + meta */}
        <section style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ padding: '32px 56px 32px', borderRight: '1px solid var(--border)' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
              letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 18,
            }}>Os três pilares</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {[
                { n: '01', t: 'Lentidão',     d: 'Tempo é matéria-prima. O Glyph trata cada cena como respiro.' },
                { n: '02', t: 'Tipografia viva', d: 'Letras como atores: tremor, neon, vibração. Cada glyph carrega intenção.' },
                { n: '03', t: 'Soberania local', d: 'Tudo roda na sua máquina. Sem nuvem, sem assinatura, sem telemetria.' },
              ].map((p) => (
                <div key={p.n} style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr', gap: 16, alignItems: 'baseline',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 36,
                    color: 'var(--accent)', letterSpacing: '-0.04em',
                  }}>{p.n}</div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22,
                      color: 'var(--text-primary)', letterSpacing: '-0.03em',
                      fontStyle: 'italic',
                      fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1",
                    }}>{p.t}</div>
                    <div style={{
                      marginTop: 4, fontFamily: 'var(--font-sans)', fontSize: 13,
                      color: 'var(--text-secondary)', lineHeight: 1.55, maxWidth: 440,
                    }}>{p.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '32px 56px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
                letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10,
              }}>Edições</div>
              <div style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 6,
              }}>
                {[
                  { l: 'Glyph Core',     v: 'v0.6.0 · atual', a: true },
                  { l: 'Glyph Obsidian', v: 'em breve · VOID Engine' },
                ].map((e, i) => (
                  <div key={e.l} style={{
                    padding: '12px 14px',
                    borderBottom: i === 0 ? '1px solid var(--border)' : 'none',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
                      color: e.a ? 'var(--text-primary)' : 'var(--text-secondary)',
                      letterSpacing: '-0.02em',
                    }}>{e.l}</div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10,
                      color: e.a ? 'var(--accent)' : 'var(--text-muted)',
                      letterSpacing: '0.10em', textTransform: 'uppercase',
                    }}>{e.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
                letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10,
              }}>Stack</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)',
                lineHeight: 1.9, letterSpacing: '0.02em',
              }}>
                <div>Tauri 2.0 · Rust core</div>
                <div>Next.js 14 · React 18</div>
                <div>FFmpeg 6.1 · NVENC / AMF / CPU</div>
                <div>Skia · WebGPU canvas</div>
              </div>
            </div>

            <div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
                letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10,
              }}>Links</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { l: 'mora.studio', i: <IconExternal size={11} /> },
                  { l: 'Manifesto Mora', i: <IconExternal size={11} /> },
                  { l: 'Changelog', i: <IconLink size={11} /> },
                  { l: 'Reportar erro', i: <IconAlert size={11} /> },
                ].map((x) => (
                  <button key={x.l} style={{
                    background: 'transparent', border: 'none', padding: '4px 0', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-primary)',
                    textAlign: 'left', letterSpacing: '-0.01em',
                  }}><span style={{ color: 'var(--text-muted)' }}>{x.i}</span> {x.l}</button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={{
          padding: '20px 56px', display: 'flex', justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
          letterSpacing: '0.10em', textTransform: 'uppercase',
        }}>
          <span>© 2026 Mora Studio · Brasil</span>
          <span>Feito com <span style={{ color: 'var(--accent)' }}>respiro</span> em Curitiba</span>
        </section>
      </main>
    </div>
  );
}

window.Toast = Toast;
window.ToastStack = ToastStack;
window.ContextMenu = ContextMenu;
window.Splash = Splash;
window.ProjectCardHover = ProjectCardHover;
window.DragGhostAndDrop = DragGhostAndDrop;
window.SettingsInlineEditPath = SettingsInlineEditPath;
window.SettingsInlineEditColor = SettingsInlineEditColor;
window.AboutScreen = AboutScreen;

// ─── Project Card states ────────────────────────────────────────────
function ProjectCardDefault({ p }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 6, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        position: 'relative', aspectRatio: '16 / 9',
        background: '#15192A', borderBottom: '1px solid var(--border)', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: '7%', top: '28%',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4.4vw, 56px)',
          color: 'var(--text-primary)', letterSpacing: '-0.05em', lineHeight: 0.9,
          fontVariationSettings: "'opsz' 144, 'SOFT' 30",
        }}>{p.hero}</div>
        <div style={{
          position: 'absolute', right: 10, bottom: 8,
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>{p.dur}</div>
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
    </div>
  );
}

function ProjectCardFocus({ p }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 6, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 0 0 2px var(--bg-deep), 0 0 0 4px var(--accent)',
    }}>
      <div style={{
        position: 'relative', aspectRatio: '16 / 9',
        background: '#15192A', borderBottom: '1px solid var(--border)', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: '7%', top: '28%',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4.4vw, 56px)',
          color: 'var(--text-primary)', letterSpacing: '-0.05em', lineHeight: 0.9,
          fontVariationSettings: "'opsz' 144, 'SOFT' 30",
        }}>{p.hero}</div>
        <div style={{
          position: 'absolute', right: 10, bottom: 8,
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>{p.dur}</div>
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
    </div>
  );
}

function CardLabel({ children, accent }) {
  return (
    <div style={{
      marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 9.5,
      color: accent ? 'var(--accent)' : 'var(--text-muted)',
      letterSpacing: '0.14em', textTransform: 'uppercase',
      textAlign: 'center',
    }}>{children}</div>
  );
}

window.ProjectCardDefault = ProjectCardDefault;
window.ProjectCardFocus = ProjectCardFocus;
window.CardLabel = CardLabel;
