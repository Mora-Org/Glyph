// Properties — contextual properties panel
function PropRow({ label, children }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '60px 1fr', gap: 10, alignItems: 'center',
      padding: '7px 0',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-secondary)',
        letterSpacing: '0.10em', textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>{children}</div>
    </div>
  );
}

function NumField({ value, suffix, scrub = true, w }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-primary)',
      background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 3,
      padding: '4px 8px', cursor: scrub ? 'ew-resize' : 'text', minWidth: 48,
      width: w, justifyContent: 'space-between',
      fontVariantNumeric: 'tabular-nums',
    }}>
      <span>{value}</span>
      {suffix && <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>{suffix}</span>}
    </div>
  );
}

function Slider({ value, max = 100 }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ flex: 1, height: 2, background: 'var(--border)', borderRadius: 1, position: 'relative', minWidth: 60 }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, height: '100%',
        width: `${pct}%`, background: 'var(--accent)',
      }} />
      <div style={{
        position: 'absolute', left: `${pct}%`, top: '50%',
        width: 8, height: 8, marginTop: -4, marginLeft: -4,
        background: 'var(--accent)', borderRadius: '50%',
      }} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        marginBottom: 6,
      }}>{title}</div>
      {children}
    </div>
  );
}

function Properties({ element, mode = 'text' }) {
  if (mode === 'scene') {
    return (
      <aside style={paneStyle}>
        <PropHeader title="Cena 02" sub="sc-2" />
        <div style={{ overflowY: 'auto', padding: '0 14px 14px' }}>
          <Section title="Cena">
            <PropRow label="Duração"><Slider value={8} max={30} /><NumField value="8.0" suffix="s" w={62} /></PropRow>
            <PropRow label="Transição">
              <SegBtn opts={['Cut', 'Fade', 'Wipe']} active={1} />
            </PropRow>
            <PropRow label="Fundo">
              <Swatch color="#1A1F33" /><span style={mono}>#1A1F33</span>
            </PropRow>
          </Section>
          <Section title="Áudio da cena">
            <PropRow label="VO"><span style={mono}>vo-cena2.wav</span></PropRow>
            <PropRow label="Volume"><Slider value={72} /><NumField value="72" suffix="%" w={56} /></PropRow>
            <PropRow label="Noise"><Toggle on /></PropRow>
          </Section>
        </div>
      </aside>
    );
  }
  return (
    <aside style={paneStyle}>
      <PropHeader title="Texto" sub={element.id} />
      <div style={{ overflowY: 'auto', padding: '0 14px 14px' }}>
        <div style={{ padding: '14px 0 10px', borderBottom: '1px solid var(--border)' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36,
            color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1,
            fontVariationSettings: "'opsz' 144, 'SOFT' 30",
          }}>{element.text}</div>
          <div style={{
            marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 9.5,
            color: 'var(--text-muted)', letterSpacing: '0.04em',
          }}>Fraunces · 900 · {element.startTime}–{element.endTime}s</div>
        </div>
        <Section title="Transform">
          <PropRow label="X / Y"><NumField value={element.x} /><NumField value={element.y} /></PropRow>
          <PropRow label="Tamanho"><Slider value={element.fontSize} max={300} /><NumField value={element.fontSize} suffix="px" w={62} /></PropRow>
          <PropRow label="Rotação"><Slider value={50} /><NumField value="0" suffix="°" w={56} /></PropRow>
          <PropRow label="Opacidade"><Slider value={100} /><NumField value="100" suffix="%" w={56} /></PropRow>
        </Section>
        <Section title="Tipo">
          <PropRow label="Fonte"><span style={{ ...mono, color: 'var(--text-primary)' }}>Fraunces</span></PropRow>
          <PropRow label="Peso"><Slider value={9} max={9} /><NumField value="900" w={56} /></PropRow>
          <PropRow label="Tracking"><Slider value={20} /><NumField value="-0.04" suffix="em" w={62} /></PropRow>
          <PropRow label="Leading"><Slider value={45} /><NumField value="0.95" w={56} /></PropRow>
          <PropRow label="Cor">
            <Swatch color={element.fill} /><span style={mono}>{element.fill}</span>
          </PropRow>
        </Section>
        <Section title="Efeitos">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {[
              { name: 'Nenhum', active: false },
              { name: 'Tremor', active: false },
              { name: 'Neon', active: true },
              { name: 'Letreiro', active: false },
            ].map((fx) => (
              <button key={fx.name} style={{
                fontFamily: 'var(--font-mono)', fontSize: 9.5, padding: '6px 8px',
                background: fx.active ? 'var(--accent)' : 'var(--bg-surface)',
                color: fx.active ? '#1A1F33' : 'var(--text-secondary)',
                border: '1px solid var(--border)', borderRadius: 3, cursor: 'pointer',
                letterSpacing: '0.06em', textAlign: 'left', textTransform: 'uppercase',
              }}>{fx.name}</button>
            ))}
          </div>
          <button style={{
            marginTop: 8, padding: '7px 10px', width: '100%',
            fontFamily: 'var(--font-mono)', fontSize: 9.5,
            background: 'transparent', color: 'var(--text-secondary)',
            border: '1px solid var(--border)', borderRadius: 3, cursor: 'pointer',
            textAlign: 'left', letterSpacing: '0.06em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontFamily: 'var(--font-display)', textTransform: 'none' }}>✦</span>
            Modo Split
            <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>⏎</span>
          </button>
        </Section>
      </div>
    </aside>
  );
}

const paneStyle = {
  width: 280, flexShrink: 0,
  borderLeft: '1px solid var(--border)', background: 'var(--bg-deep)',
  display: 'flex', flexDirection: 'column', overflow: 'hidden',
};
const mono = { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' };

function PropHeader({ title, sub }) {
  return (
    <div style={{
      padding: '10px 14px', borderBottom: '1px solid var(--border)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)',
        letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>{title}</div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)',
        letterSpacing: '0.04em',
      }}>{sub}</div>
    </div>
  );
}

function SegBtn({ opts, active }) {
  return (
    <div style={{
      display: 'flex', flex: 1,
      background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 3,
      padding: 1,
    }}>
      {opts.map((o, i) => (
        <button key={o} style={{
          flex: 1, fontFamily: 'var(--font-mono)', fontSize: 9.5,
          padding: '4px 6px',
          background: i === active ? 'var(--bg-elevated)' : 'transparent',
          color: i === active ? 'var(--text-primary)' : 'var(--text-secondary)',
          border: 'none', borderRadius: 2, cursor: 'pointer',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>{o}</button>
      ))}
    </div>
  );
}

function Swatch({ color }) {
  return <div style={{
    width: 16, height: 16, borderRadius: 2, background: color,
    border: '1px solid var(--border)', flexShrink: 0,
  }} />;
}

function Toggle({ on }) {
  return (
    <div style={{
      width: 26, height: 14, borderRadius: 999,
      background: on ? 'var(--accent)' : 'var(--border)',
      position: 'relative', cursor: 'pointer',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 14 : 2,
        width: 10, height: 10, borderRadius: '50%',
        background: on ? '#1A1F33' : 'var(--text-secondary)',
        transition: 'left 120ms cubic-bezier(0.2,0,0,1)',
      }} />
    </div>
  );
}

window.Properties = Properties;
window.PropRow = PropRow;
window.NumField = NumField;
window.Slider = Slider;
window.Section = Section;
window.SegBtn = SegBtn;
window.Toggle = Toggle;
window.Swatch = Swatch;
