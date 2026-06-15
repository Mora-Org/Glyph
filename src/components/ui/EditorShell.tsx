'use client';

import React from 'react';
import Topbar from '@/components/ui/Topbar';
import EditorSidebar from '@/components/ui/EditorSidebar';

interface EditorShellProps {
  projectName: string;
  lettering: boolean;
  onLettering: () => void;
  onExport: () => void;
  onBack: () => void;
  children: React.ReactNode;
  properties?: React.ReactNode;
}

export default function EditorShell({
  projectName,
  lettering,
  onLettering,
  onExport,
  onBack,
  children,
  properties = null,
}: EditorShellProps) {
  return (
    <div className="glyph-root flex h-screen w-screen flex-col overflow-hidden">
      <Topbar
        projectName={projectName}
        lettering={lettering}
        onLettering={onLettering}
        onExport={onExport}
        onBack={onBack}
      />
      <div className="flex min-h-0 flex-1">
        <EditorSidebar />
        <main className="flex min-w-0 flex-1 overflow-hidden">{children}</main>
        {properties}
      </div>
    </div>
  );
}
