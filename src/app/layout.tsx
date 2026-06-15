import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Glyph — O Respiro do Ensaio Visual',
  description: 'Glyph by Mora — Software de autoria visual com controle estético granular.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preload" href="/fonts/Geist_wght_.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Fraunces[SOFT,WONK,opsz,wght].ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className="glyph-root">{children}</body>
    </html>
  );
}
