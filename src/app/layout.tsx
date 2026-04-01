import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Glyph — O Respiro do Ensaio Visual',
  description: 'Glyph by Mora — Software de autoria visual com controle estético granular.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
