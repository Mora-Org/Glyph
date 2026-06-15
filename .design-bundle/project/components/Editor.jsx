// Editor — composes Topbar, Sidebar, Canvas, Properties, Timeline, SceneList
function Editor({ projectName = 'Ensaio Verão 2026', onExport, onLettering, onBack, emptyCanvas = false }) {
  const scene = {
    id: 'sc-2', name: 'Cena 02', duration: 8,
    elements: [
      { id: 'el-1', type: 'text',  name: 'Respiro',     start: 0,   end: 5.5, selected: true },
      { id: 'el-2', type: 'text',  name: 'do ensaio',   start: 1.5, end: 7 },
      { id: 'el-3', type: 'image', name: 'capa-verao',  start: 0.5, end: 6 },
      { id: 'el-4', type: 'video', name: 'timelapse',   start: 2,   end: 8 },
    ],
  };
  const scenes = [
    { kind: 'scene', id: 'sc-1', idx: 1, name: 'Abertura', duration: 5, transition: 'cut',  hero: 'Silêncio', heroColor: 'var(--text-primary)' },
    { kind: 'scene', id: 'sc-2', idx: 2, name: 'Cena 02',  duration: 8, transition: 'fade', hero: 'Respiro',  heroColor: 'var(--text-primary)' },
    { kind: 'pause', id: 'p-1',  type: 'vhs',   duration: 3 },
    { kind: 'scene', id: 'sc-3', idx: 3, name: 'Encerra',  duration: 6, transition: 'cut',  hero: 'do fim',   heroColor: 'var(--accent)', italic: true },
    { kind: 'pause', id: 'p-2',  type: 'black', duration: 2 },
  ];
  const selectedElement = {
    id: 'el-1', text: 'Respiro', x: 320, y: 180, fontSize: 88,
    fill: '#F0E7D5', startTime: 0, endTime: 5.5,
  };
  const [activeId, setActiveId] = React.useState('sc-2');
  const [activeAsset, setActiveAsset] = React.useState('timelapse.mp4');

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', width: '100%',
      background: 'var(--bg-deep)', overflow: 'hidden',
    }}>
      <Topbar projectName={projectName} onExport={onExport} onLettering={onLettering} onBack={onBack} />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar activeAsset={activeAsset} onPick={(a) => setActiveAsset(a.name)} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {emptyCanvas ? <EmptyCanvas scene={scene} /> : <Canvas scene={scene} />}
          <ElementTimeline scene={scene} />
          <SceneList scenes={scenes} activeId={activeId} setActive={setActiveId} />
        </div>
        <Properties element={selectedElement} />
      </div>
    </div>
  );
}

window.Editor = Editor;
