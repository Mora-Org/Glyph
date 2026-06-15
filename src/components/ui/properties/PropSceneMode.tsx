'use client';

import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import type { Scene, TransitionType } from '@/store/projectStore';
import { Slider, NumField, SegBtn } from '@/components/glyph';
import { PropHeader, PropSection, PropRow } from './PropPrimitives';

const TRANSITIONS: { value: TransitionType; label: string }[] = [
  { value: 'cut', label: 'Cut' },
  { value: 'fade', label: 'Fade' },
];

export default function PropSceneMode({ scene }: { scene: Scene }) {
  const updateScene = useProjectStore((s) => s.updateScene);
  const [duration, setDuration] = useState(scene.duration);

  const commitDuration = (d: number) => updateScene(scene.id, { duration: d });

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <PropHeader title={scene.name} sub={`sc-${scene.id.slice(0, 4)}`} />

      <PropSection title="Cena">
        <PropRow label="Duração">
          <Slider
            value={duration}
            min={1}
            max={30}
            step={1}
            onChange={setDuration}
            onCommit={() => commitDuration(duration)}
          />
          <NumField
            value={duration}
            min={1}
            max={30}
            unit="s"
            width={52}
            onChange={setDuration}
            onCommit={() => commitDuration(duration)}
          />
        </PropRow>
        <PropRow label="Transição">
          <SegBtn
            options={TRANSITIONS}
            value={scene.transition}
            onChange={(t) => updateScene(scene.id, { transition: t })}
          />
        </PropRow>
      </PropSection>

      <PropSection title="Elementos">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
          {scene.elements.length} elemento{scene.elements.length === 1 ? '' : 's'} · selecione um para editar
        </span>
      </PropSection>
    </div>
  );
}
