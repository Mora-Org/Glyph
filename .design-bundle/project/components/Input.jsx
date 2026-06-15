// Glyph Input — label above, mono UPPERCASE, optional error.
function GlyphInput({ label, error, value, onChange, placeholder, autoFocus, type = 'text' }) {
  const [focus, setFocus] = React.useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)',
          letterSpacing: '0.08em', textTransform: 'uppercase'
        }}>{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-primary)',
          background: 'var(--bg-surface)',
          border: `1px solid ${error ? 'var(--danger)' : focus ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 4, padding: '8px 10px', outline: 'none',
          boxShadow: focus && !error ? '0 0 0 2px var(--accent-ring)' : 'none',
          transition: 'all 120ms cubic-bezier(0.2,0,0,1)',
        }}
      />
      {error && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#C8485C' }}>{error}</div>
      )}
    </div>
  );
}

window.GlyphInput = GlyphInput;
