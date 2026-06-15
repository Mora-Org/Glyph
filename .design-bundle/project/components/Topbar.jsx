// Topbar — wordmark + project name + Lettering toggle + Export
function Topbar({ projectName, lettering, onLettering, onExport, autosave = 'salvo · 14:32', onBack }) {
  return (
    <header style={{
      height: 40, flexShrink: 0,
      borderBottom: '1px solid var(--border)', background: 'var(--bg-deep)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 14px', gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {onBack && (
          <button onClick={onBack} style={{
            background: 'transparent', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', padding: 4, display: 'flex',
          }}><IconArrowLeft size={14} /></button>
        )}
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18,
          color: 'var(--text-primary)', letterSpacing: '-0.04em',
          fontVariationSettings: "'opsz' 144, 'SOFT' 30",
        }}>
          Gl<span style={{ color: 'var(--accent)' }}>y</span>ph
        </div>
        <div style={{
          width: 1, height: 14, background: 'var(--border)',
        }} />
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)',
          letterSpacing: '0.04em',
        }}>
          {projectName}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--success)' }} />
          {autosave}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={onLettering} style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, padding: '5px 10px',
          background: lettering ? 'var(--bg-elevated)' : 'transparent',
          color: lettering ? 'var(--text-primary)' : 'var(--text-secondary)',
          border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer',
          letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 5,
          transition: 'all 120ms',
        }}>
          <span style={{ fontFamily: 'var(--font-display)' }}>✦</span> Lettering
        </button>
        <GlyphButton variant="primary" size="sm" onClick={onExport}>Exportar</GlyphButton>
      </div>
    </header>
  );
}

window.Topbar = Topbar;
