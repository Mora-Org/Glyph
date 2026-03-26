'use client';

import Dashboard from '@/components/ui/Dashboard';
import Editor from '@/components/ui/Editor';
import { useProjectStore } from '@/store/projectStore';

export default function Home() {
  const project = useProjectStore((s) => s.project);

  if (!project) return <Dashboard />;
  return <Editor />;
}
