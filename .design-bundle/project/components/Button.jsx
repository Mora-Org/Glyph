// Glyph Button — primary, secondary, ghost, danger.
const buttonVariants = {
  primary:   { background: 'var(--accent)', color: '#1A1F33', border: '1px solid transparent' },
  secondary: { background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' },
  ghost:     { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent' },
  danger:    { background: 'transparent', color: '#C8485C', border: '1px solid rgba(139,40,56,0.4)' },
};

const buttonSizes = {
  sm: { padding: '6px 12px', fontSize: 12 },
  md: { padding: '8px 14px', fontSize: 13 },
  lg: { padding: '10px 18px', fontSize: 14 },
};

function GlyphButton({ variant = 'secondary', size = 'md', children, style, ...props }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  const base = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    borderRadius: 6,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'all 120ms cubic-bezier(0.2,0,0,1)',
    transform: press && variant === 'primary' ? 'scale(0.98)' : 'scale(1)',
    ...buttonVariants[variant],
    ...buttonSizes[size],
  };

  if (hover) {
    if (variant === 'primary')   base.background = 'var(--accent-hover)';
    if (variant === 'secondary') base.background = 'var(--bg-elevated)';
    if (variant === 'ghost')     { base.color = 'var(--text-primary)'; base.background = 'var(--bg-surface)'; }
    if (variant === 'danger')    { base.background = 'var(--danger-soft)'; base.color = '#E06678'; }
  }

  return (
    <button
      style={{ ...base, ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      {...props}
    >
      {children}
    </button>
  );
}

window.GlyphButton = GlyphButton;
