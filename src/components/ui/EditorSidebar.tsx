'use client';

import React, { useState } from 'react';
import TabBar, { type Tab } from '@/components/ui/sidebar/TabBar';
import MediaTab, { type AssetFile } from '@/components/ui/sidebar/MediaTab';
import FontsTab from '@/components/ui/sidebar/FontsTab';
import EffectsTab from '@/components/ui/sidebar/EffectsTab';
import PausesTab from '@/components/ui/sidebar/PausesTab';

const TABS: Tab[] = [
  { id: 'midia', label: 'Mídia' },
  { id: 'tipos', label: 'Tipos' },
  { id: 'efeitos', label: 'Efeitos' },
  { id: 'pausas', label: 'Pausas' },
];

const ACCEPTED = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp4', '.mov', '.webm'];

function inferType(name: string): AssetFile['type'] {
  if (name.endsWith('.gif')) return 'gif';
  if (['.mp4', '.mov', '.webm'].some((ext) => name.endsWith(ext))) return 'video';
  return 'image';
}

export default function EditorSidebar() {
  const [tab, setTab] = useState('midia');
  // Estado mantido na sidebar (não nas abas): trocar de aba desmonta o conteúdo,
  // então os assets importados e a seleção precisam sobreviver aqui.
  const [files, setFiles] = useState<AssetFile[]>([]);
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);

  function handleFolderSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const assets: AssetFile[] = selected
      .filter((f) => ACCEPTED.some((ext) => f.name.toLowerCase().endsWith(ext)))
      .map((f) => ({
        name: f.name,
        path: URL.createObjectURL(f),
        type: inferType(f.name.toLowerCase()),
      }));
    setFiles((prev) => [...prev, ...assets]);
  }

  return (
    <aside
      className="flex flex-col overflow-hidden border-r"
      style={{ width: 'var(--layout-sidebar-left)', background: 'var(--bg-deep)', borderColor: 'var(--border)' }}
    >
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {tab === 'midia' && (
          <MediaTab
            files={files}
            activeId={activeMediaId}
            onSelect={setActiveMediaId}
            onFolderSelect={handleFolderSelect}
            accept={ACCEPTED.join(',')}
          />
        )}
        {tab === 'tipos' && <FontsTab />}
        {tab === 'efeitos' && <EffectsTab />}
        {tab === 'pausas' && <PausesTab />}
      </div>
    </aside>
  );
}
