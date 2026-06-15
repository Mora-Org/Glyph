'use client';

import React from 'react';
import { useProjectStore } from '@/store/projectStore';
import type { Scene } from '@/store/projectStore';
import type { MainCanvasHandle } from '@/components/canvas/MainCanvas';
import PropTextMode from './PropTextMode';
import PropSceneMode from './PropSceneMode';

interface PropertiesPanelProps {
  scene: Scene;
  canvasHandle: React.RefObject<MainCanvasHandle | null>;
}

export default function PropertiesPanel({ scene, canvasHandle }: PropertiesPanelProps) {
  const selectedElementId = useProjectStore((s) => s.selectedElementId);
  const selected = scene.elements.find((el) => el.id === selectedElementId);
  const isText = selected?.type === 'text';

  return (
    <aside
      className="flex flex-col overflow-hidden border-l"
      style={{ width: 'var(--layout-sidebar-right)', background: 'var(--bg-deep)', borderColor: 'var(--border)' }}
      data-testid="properties-panel"
    >
      {isText && selected ? (
        <PropTextMode
          key={selected.id}
          element={selected}
          sceneId={scene.id}
          canvasHandle={canvasHandle}
        />
      ) : (
        <PropSceneMode scene={scene} />
      )}
    </aside>
  );
}
