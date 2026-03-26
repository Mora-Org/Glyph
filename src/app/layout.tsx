import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PEG — Gerador de Ensaios Visuais',
  description: 'Software desktop para criação de ensaios visuais com controle estético granular.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
