// Modals — New Project, Export, Lettering Studio, plus Settings & toasts

function ModalShell({ children, w = 480, onClose, dismissible = true }) {
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget && dismissible && onClose) onClose(); }} style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: 'rgba(10, 13, 26, 0.72)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: w, background: 'var(--bg-elevated)',
        border: '1px solid var(--border)', borderRadius: 10,
        boxShadow: '0 24px 64px -16px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column',
      }}>{children}</div>
    </div>
  );
}

function ModalHead({ title, sub, onClose }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '18px 20px 14px', borderBottom: '1px solid var(--border)',
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 600,
          color: 'var(--text-primary)', letterSpacing: '-0.01em',
        }}>{title}</div>
        {sub && <div style={{
          marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--text-secondary)', letterSpacing: '0.10em', textTransform: 'uppercase',
        }}>{sub}</div>}
      </div>
      {onClose && <button onClick={onClose} style={{
        background: 'transparent', border: 'none', color: 'var(--text-muted)',
        cursor: 'pointer', padding: 4, display: 'flex',
      }}><IconClose size={16} /></button>}
    </div>
  );
}

// ─── Export Modal ───────────────────────────────────────────────────
function ExportModal({ projectName = 'Ensaio Verão 2026', onClose, mode = 'idle' }) {
  const rows = [
    ['Formato',     'MP4 (H.264)'],
    ['Resolução',   '1280 × 720'],
    ['Frame Rate',  '30 fps'],
    ['Bitrate',     '8 Mbps · CRF 22'],
    ['Aceleração',  'NVENC (Auto)'],
    ['Range',       'Projeto inteiro'],
  ];
  const progress = mode === 'rendering' ? 64 : 100;
  const msg = mode === 'rendering' ? 'Codificando vídeo...' : 'Exportação concluída.';

  return (
    <ModalShell w={520} onClose={onClose} dismissible={mode !== 'rendering'}>
      <ModalHead title="Exportar Projeto" sub={projectName} onClose={mode !== 'rendering' ? onClose : null} />

      <div style={{ padding: '14px 20px' }}>
        {/* Preview */}
        <div style={{
          aspectRatio: '16 / 9', background: '#15192A',
          border: '1px solid var(--border)', borderRadius: 4,
          marginBottom: 14, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: '7%', top: '24%',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px, 5vw, 52px)',
            color: 'var(--text-primary)', letterSpacing: '-0.05em', lineHeight: 0.9,
            fontVariationSettings: "'opsz' 144, 'SOFT' 30",
          }}>Respiro</div>
          <div style={{
            position: 'absolute', left: '13%', top: '48%',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(24px, 5vw, 52px)',
            color: 'var(--accent)', letterSpacing: '-0.05em', lineHeight: 0.9, fontStyle: 'italic',
            fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1",
          }}>do ensaio</div>
          <div style={{
            position: 'absolute', right: 10, bottom: 8,
            fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>cena 01 · preview</div>
        </div>

        {mode === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {rows.map(([k, v], i) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '9px 0',
                borderTop: '1px solid var(--border)',
                borderBottom: i === rows.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--text-secondary)', letterSpacing: '0.10em', textTransform: 'uppercase',
                }}>{k}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'var(--text-primary)', letterSpacing: '0.04em',
                  fontVariantNumeric: 'tabular-nums',
                }}>{v}</span>
              </div>
            ))}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '9px 0',
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--text-muted)', letterSpacing: '0.04em',
            }}>
              <span style={{ letterSpacing: '0.10em', textTransform: 'uppercase' }}>Estimativa</span>
              <span>~ 18 MB · 24s</span>
            </div>
          </div>
        )}

        {mode === 'rendering' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}>
            <div style={{ height: 2, background: 'var(--border)', borderRadius: 1, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>{msg}</span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-primary)',
                fontVariantNumeric: 'tabular-nums',
              }}>{progress}%</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>Frame 412 / 720</span>
              <span>~ 8s restantes · NVENC</span>
            </div>
          </div>
        )}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: 8,
        padding: '12px 20px', borderTop: '1px solid var(--border)',
      }}>
        {mode === 'idle' && (
          <>
            <GlyphButton variant="ghost" size="sm" onClick={onClose}>Cancelar</GlyphButton>
            <GlyphButton variant="primary" size="sm">Iniciar Exportação</GlyphButton>
          </>
        )}
        {mode === 'rendering' && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
            letterSpacing: '0.10em', textTransform: 'uppercase',
          }}>Renderizando — não feche o app</span>
        )}
      </div>
    </ModalShell>
  );
}

// ─── New Project Modal ──────────────────────────────────────────────
function NewProjectModal({ onClose, error = false }) {
  return (
    <ModalShell w={440} onClose={onClose}>
      <ModalHead title="Novo Projeto" sub="Configuração inicial" onClose={onClose} />
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <GlyphInput
          label="Nome do projeto"
          placeholder="ex: Ensaio Verão 2026"
          value={error ? '   ' : 'Ensaio Verão 2026'}
          onChange={() => {}}
          error={error ? 'O nome do projeto é obrigatório.' : null}
        />
        <div>
          <label style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)',
            letterSpacing: '0.10em', textTransform: 'uppercase', display: 'block', marginBottom: 6,
          }}>Resolução base</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
            {[
              { l: '9:16', sub: '1080×1920' },
              { l: '16:9', sub: '1920×1080', active: true },
              { l: '1:1',  sub: '1080×1080' },
              { l: 'CSTM', sub: 'Custom' },
            ].map((r, i) => (
              <button key={i} style={{
                padding: '10px 6px', background: r.active ? 'var(--bg-deep)' : 'var(--bg-surface)',
                border: r.active ? '1px solid var(--accent)' : '1px solid var(--border)',
                borderRadius: 4, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                  color: r.active ? 'var(--accent)' : 'var(--text-primary)',
                  letterSpacing: '0.04em',
                }}>{r.l}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
                  letterSpacing: '0.04em',
                }}>{r.sub}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)',
            letterSpacing: '0.10em', textTransform: 'uppercase', display: 'block', marginBottom: 6,
          }}>Frame Rate</label>
          <div style={{ display: 'flex', gap: 4 }}>
            {['24 fps', '30 fps', '60 fps'].map((f, i) => (
              <button key={f} style={{
                flex: 1, padding: '8px 12px',
                background: i === 1 ? 'var(--bg-deep)' : 'var(--bg-surface)',
                border: i === 1 ? '1px solid var(--accent)' : '1px solid var(--border)',
                color: i === 1 ? 'var(--accent)' : 'var(--text-secondary)',
                borderRadius: 4, cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em',
                fontVariantNumeric: 'tabular-nums',
              }}>{f}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: 8,
        padding: '12px 20px', borderTop: '1px solid var(--border)',
      }}>
        <GlyphButton variant="ghost" size="sm" onClick={onClose}>Cancelar</GlyphButton>
        <GlyphButton variant="primary" size="sm">Criar</GlyphButton>
      </div>
    </ModalShell>
  );
}

// ─── Lettering Studio (modal/full canvas) ───────────────────────────
function LetteringStudio({ onClose }) {
  const word = 'Respiro';
  return (
    <ModalShell w={920} onClose={onClose}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 20px', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--accent)' }}>✦</span>
          <div>
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 600,
              color: 'var(--text-primary)', letterSpacing: '-0.01em',
            }}>Lettering Studio</div>
            <div style={{
              marginTop: 2, fontFamily: 'var(--font-mono)', fontSize: 9.5,
              color: 'var(--text-secondary)', letterSpacing: '0.10em', textTransform: 'uppercase',
            }}>Cena 02 · Texto · 7 caracteres</div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'transparent', border: 'none', color: 'var(--text-muted)',
          cursor: 'pointer', padding: 4, display: 'flex',
        }}><IconClose size={16} /></button>
      </div>

      {/* Preview canvas */}
      <div style={{
        height: 280, background: '#15192A',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(240,231,213,0.04) 1px, transparent 0)',
          backgroundSize: '14px 14px',
        }} />
        <div style={{ display: 'flex', gap: 4, position: 'relative' }}>
          {word.split('').map((ch, i) => {
            // vary baseline offset / rotation per char (tremor)
            const dy = [0, -3, 2, -1, 4, -2, 0][i] || 0;
            const dr = [-1, 2, -1, 0, 2, -1, 0][i] || 0;
            const isAccent = i === 3;
            return (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 124,
                  color: isAccent ? 'var(--accent)' : 'var(--text-primary)',
                  letterSpacing: '-0.03em', lineHeight: 1,
                  transform: `translateY(${dy}px) rotate(${dr}deg)`,
                  fontVariationSettings: "'opsz' 144, 'SOFT' 30",
                  display: 'inline-block',
                }}>{ch}</div>
                {/* per-glyph selection box */}
                <div style={{
                  position: 'absolute', inset: -6,
                  border: i === 0 ? '1px solid var(--accent)' : '1px dashed rgba(232,181,71,0.35)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', left: 0, top: -18,
                  fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--text-muted)',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>g{String(i+1).padStart(2,'0')}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', borderBottom: '1px solid var(--border)' }}>
        <div style={{ padding: '14px 20px', borderRight: '1px solid var(--border)' }}>
          <label style={{
            fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-secondary)',
            letterSpacing: '0.10em', textTransform: 'uppercase', display: 'block', marginBottom: 6,
          }}>String</label>
          <input value={word} onChange={() => {}} style={{
            width: '100%',
            fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
            color: 'var(--text-primary)', background: 'var(--bg-deep)',
            border: '1px solid var(--border)', borderRadius: 4,
            padding: '10px 12px', outline: 'none', letterSpacing: '-0.03em',
          }} />
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Toggle on />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-primary)',
              letterSpacing: '0.10em', textTransform: 'uppercase',
            }}>Modo Split — cada caractere é um objeto</span>
          </div>
        </div>
        <div style={{ padding: '14px 20px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-secondary)',
            letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 6,
          }}>Efeito por glyph</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {[
              { n: 'Tremor de Ansiedade', a: true },
              { n: 'Neon Flicker' },
              { n: 'Vibration' },
              { n: 'Letreiro' },
            ].map((fx) => (
              <button key={fx.n} style={{
                fontFamily: 'var(--font-mono)', fontSize: 9.5, padding: '8px 10px',
                background: fx.a ? 'var(--accent)' : 'var(--bg-surface)',
                color: fx.a ? '#1A1F33' : 'var(--text-secondary)',
                border: '1px solid var(--border)', borderRadius: 3,
                cursor: 'pointer', textAlign: 'left', letterSpacing: '0.04em',
              }}>{fx.n}</button>
            ))}
          </div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '70px 1fr 50px', gap: 10, alignItems: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)',
                letterSpacing: '0.10em', textTransform: 'uppercase',
              }}>Intensidade</span>
              <Slider value={62} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-primary)',
                fontVariantNumeric: 'tabular-nums', textAlign: 'right',
              }}>62%</span>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '70px 1fr 50px', gap: 10, alignItems: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)',
                letterSpacing: '0.10em', textTransform: 'uppercase',
              }}>Velocidade</span>
              <Slider value={40} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-primary)',
                fontVariantNumeric: 'tabular-nums', textAlign: 'right',
              }}>0.8s</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>Preview animado · loop a cada 0.8s</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <GlyphButton variant="ghost" size="sm" onClick={onClose}>Cancelar</GlyphButton>
          <GlyphButton variant="primary" size="sm">Aplicar à Cena</GlyphButton>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Settings ───────────────────────────────────────────────────────
function Settings({ onBack }) {
  const SETTING_GROUPS = [
    {
      label: 'Aparência', items: [
        { k: 'Modo', v: 'Dark', accent: true, hint: 'Light disponível, opt-in' },
        { k: 'Densidade', v: 'Confortável' },
        { k: 'Acento', v: '#E8B547', swatch: '#E8B547' },
      ],
    },
    {
      label: 'FFmpeg', items: [
        { k: 'Binário', v: '/usr/local/bin/ffmpeg', mono: true },
        { k: 'Versão', v: '6.1.1 · auto-detectado', mono: true, ok: true },
        { k: 'Encoder', v: 'NVENC (RTX 4070)', mono: true, hint: 'AMF e CPU disponíveis' },
      ],
    },
    {
      label: 'Pastas padrão', items: [
        { k: 'Assets',  v: '~/Mora/Glyph/assets',  mono: true },
        { k: 'Exports', v: '~/Mora/Glyph/exports', mono: true },
      ],
    },
    {
      label: 'Atalhos', items: [
        { k: 'Play/Pause', v: 'Espaço', mono: true },
        { k: 'Seleção · Texto · Pan', v: 'V · T · H', mono: true },
        { k: 'Shuttle', v: 'J · K · L', mono: true },
        { k: 'Duplicar · Remover · Undo', v: 'Ctrl+D · Del · Ctrl+Z', mono: true },
      ],
    },
  ];
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
          {SETTING_GROUPS.map((g, i) => (
            <button key={g.label} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10.5,
              padding: '6px 10px',
              background: i === 0 ? 'var(--bg-surface)' : 'transparent',
              borderLeft: i === 0 ? '2px solid var(--accent)' : '2px solid transparent',
              color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: 'none', borderRadius: i === 0 ? '0 4px 4px 0' : 4,
              cursor: 'pointer', textAlign: 'left',
              letterSpacing: '0.06em',
            }}>{g.label}</button>
          ))}
          <button style={{
            fontFamily: 'var(--font-mono)', fontSize: 10.5,
            padding: '6px 10px', background: 'transparent',
            color: 'var(--text-secondary)', border: 'none',
            cursor: 'pointer', textAlign: 'left', letterSpacing: '0.06em',
          }}>Sobre</button>
        </nav>
        <div style={{ flex: 1 }} />
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
          letterSpacing: '0.10em', textTransform: 'uppercase',
        }}>v0.6.0 · Core</div>
      </aside>
      <main style={{ flex: 1, overflowY: 'auto', padding: '36px 48px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
          letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>Aparência · FFmpeg · Pastas · Atalhos</div>
        <h1 style={{
          marginTop: 8, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 40,
          color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1,
          fontVariationSettings: "'opsz' 144, 'SOFT' 30",
        }}>Como o <span style={{ fontStyle: 'italic', color: 'var(--accent)', fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}>Glyph</span> respira em sua máquina.</h1>

        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 720 }}>
          {SETTING_GROUPS.map((g) => (
            <section key={g.label} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 6,
            }}>
              <div style={{
                padding: '10px 16px', borderBottom: '1px solid var(--border)',
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)',
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>{g.label}</div>
              {g.items.map((it, i) => (
                <div key={it.k} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 14, alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: i < g.items.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-primary)',
                      letterSpacing: '-0.01em',
                    }}>{it.k}</div>
                    {it.hint && <div style={{
                      marginTop: 2, fontFamily: 'var(--font-mono)', fontSize: 9.5,
                      color: 'var(--text-muted)', letterSpacing: '0.04em',
                    }}>{it.hint}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {it.swatch && <Swatch color={it.swatch} />}
                    <span style={{
                      fontFamily: it.mono ? 'var(--font-mono)' : 'var(--font-sans)',
                      fontSize: it.mono ? 11 : 13,
                      color: it.accent ? 'var(--accent)' : 'var(--text-primary)',
                      letterSpacing: it.mono ? '0.04em' : '-0.01em',
                    }}>{it.v}</span>
                    {it.ok && <span style={{ color: 'var(--success)', display: 'flex' }}><IconCheck size={11} /></span>}
                  </div>
                  <button style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9.5,
                    background: 'transparent', color: 'var(--text-secondary)',
                    border: '1px solid var(--border)', borderRadius: 3,
                    padding: '4px 8px', cursor: 'pointer',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}>Editar</button>
                </div>
              ))}
            </section>
          ))}

          <section style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 6, padding: 20,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
                letterSpacing: '0.14em', textTransform: 'uppercase',
              }}>Edição</div>
              <div style={{
                marginTop: 4, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
                color: 'var(--text-primary)', letterSpacing: '-0.03em',
              }}>Glyph Core <span style={{ color: 'var(--text-muted)' }}>·</span> v0.6.0</div>
              <div style={{
                marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)',
                letterSpacing: '0.04em',
              }}>Glyph Obsidian <span style={{ color: 'var(--text-muted)' }}>·</span> em breve · VOID Engine · 12GB+ VRAM</div>
            </div>
            <GlyphButton variant="secondary" size="sm">Manifesto Mora</GlyphButton>
          </section>
        </div>
      </main>
    </div>
  );
}

// ─── Error state ────────────────────────────────────────────────────
function ErrorModal({ onClose }) {
  return (
    <ModalShell w={460} onClose={onClose}>
      <div style={{ padding: '22px 22px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ color: 'var(--danger)', display: 'flex' }}><IconAlert size={18} /></span>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--danger)',
            letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>FFmpeg não encontrado</div>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26,
          color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.05,
        }}>Glyph não conseguiu localizar o<br />FFmpeg na sua máquina.</div>
        <div style={{
          marginTop: 10, fontFamily: 'var(--font-sans)', fontSize: 13,
          color: 'var(--text-secondary)', lineHeight: 1.55,
        }}>Sem o FFmpeg, a exportação fica indisponível. Você pode definir o caminho manualmente em Configurações → FFmpeg, ou instalar via gerenciador de pacotes do sistema.</div>
        <div style={{
          marginTop: 14, padding: 10,
          background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: 4,
          fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-secondary)',
          letterSpacing: '0.04em',
        }}>
          <span style={{ color: 'var(--text-muted)' }}>$ </span>sudo apt install ffmpeg
        </div>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: 8,
        padding: '12px 20px', borderTop: '1px solid var(--border)',
      }}>
        <GlyphButton variant="ghost" size="sm" onClick={onClose}>Fechar</GlyphButton>
        <GlyphButton variant="secondary" size="sm">Definir caminho...</GlyphButton>
      </div>
    </ModalShell>
  );
}

window.ExportModal = ExportModal;
window.NewProjectModal = NewProjectModal;
window.LetteringStudio = LetteringStudio;
window.Settings = Settings;
window.ErrorModal = ErrorModal;
