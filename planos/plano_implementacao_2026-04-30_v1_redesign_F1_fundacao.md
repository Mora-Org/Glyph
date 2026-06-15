# F1 — Fundação Glyph DS
Data: 2026-04-30 · Versão: 1.0
Parte do [Glyph Redesign Master](plano_implementacao_2026-04-30_v1_glyph_redesign_master.md)

**Bloqueia:** F2, F3, F4, F5, F6, F7, F8.
**Tamanho:** S (~meio dia).

Fase fundacional: tokens, fontes, primitivas. Nenhuma tela é reescrita aqui — mas após esta fase qualquer tela legada já herda o novo palette/tipo automaticamente.

---

## 1. Objetivos

- Migrar `src/app/globals.css` para usar os tokens canônicos do Glyph DS.
- Substituir Google Fonts (Inter/Nunito/JetBrains) por **self-hosted Fraunces / Geist / Geist Mono** (variáveis).
- Criar primitivas reutilizáveis em `src/components/glyph/`: `GlyphButton`, `GlyphInput`, `Toggle`, `Slider`, `Swatch`, `NumField`, `SegBtn`.
- Criar set de ícones Lucide-style consistente em `src/components/glyph/Icons.tsx`.
- Documentar uso em `src/components/glyph/README.md`.

---

## 2. Arquivos-alvo

### Modificar
- `src/app/globals.css` — adicionar `:root` com todos os tokens; remover overrides legados de cor/tipografia.
- `src/app/layout.tsx` — remover `<link>` Google Fonts; adicionar preload local.
- `tailwind.config.ts` (ou `@theme inline` no globals.css) — mapear tokens para utilities.

### Criar
- `public/fonts/Fraunces[SOFT,WONK,opsz,wght].woff2`
- `public/fonts/Fraunces-Italic[SOFT,WONK,opsz,wght].woff2`
- `public/fonts/Geist[wght].woff2`
- `public/fonts/GeistMono[wght].woff2`
- `src/components/glyph/GlyphButton.tsx`
- `src/components/glyph/GlyphInput.tsx`
- `src/components/glyph/Toggle.tsx`
- `src/components/glyph/Slider.tsx`
- `src/components/glyph/Swatch.tsx`
- `src/components/glyph/NumField.tsx`
- `src/components/glyph/SegBtn.tsx`
- `src/components/glyph/Icons.tsx`
- `src/components/glyph/index.ts` (barrel export)
- `src/components/glyph/README.md`

### Não tocar
- Componentes existentes em `ui/`, `timeline/`, `canvas/`, `typography/` permanecem intactos. Eles vão automaticamente herdar palette via CSS vars.

---

## 3. Implementação detalhada

### 3.1. globals.css

Estrutura:
```css
@import 'tailwindcss';

@font-face { /* Fraunces, Fraunces-Italic, Geist, Geist Mono */ }

:root {
  /* Cores (surfaces, text, accent, semantic) */
  /* Type scale */
  /* Spacing 4px grid */
  /* Radii, layout, shadows, motion */
}

@theme inline {
  /* Mapear vars para Tailwind utilities:
     --color-bg-deep, --color-text-primary, --color-accent,
     --font-sans, --font-display, --font-mono, etc. */
}

/* Classes semânticas: glyph-display-xl, glyph-h1, glyph-body, glyph-label, glyph-mono, glyph-data */
```

> Copiar 1:1 de `.design-bundle/glyph/project/ds/colors_and_type.css`, adaptando paths de fonte para `/fonts/...` (public).

### 3.2. layout.tsx

```tsx
<head>
  <link rel="preload" href="/fonts/Geist[wght].woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
  <link rel="preload" href="/fonts/Fraunces[SOFT,WONK,opsz,wght].woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
</head>
<body className="glyph-root">{children}</body>
```

Remover bloco `<link href="https://fonts.googleapis.com/...">`.

### 3.3. Primitivas

Cada primitiva é tradução fiel do equivalente em `.design-bundle/glyph/project/components/`:

| Componente | Origem | API mínima |
|---|---|---|
| `GlyphButton` | `Button.jsx` | `variant: 'primary' \| 'secondary' \| 'ghost' \| 'danger'`; `size: 'sm' \| 'md' \| 'lg'`; hover/press states |
| `GlyphInput` | `Input.jsx` | `label`, `error`, `value`, `onChange`, `placeholder`; ring de foco amarelo, borda Bordeaux em erro |
| `Toggle` | `Properties.jsx` | `on: boolean`, `onChange` |
| `Slider` | `Properties.jsx` | `value`, `max`, `onChange`, height 2px com knob 8px |
| `Swatch` | `Properties.jsx` | `color: string` (ou hex) |
| `NumField` | `Properties.jsx` | `value`, `suffix?`, `scrub?: boolean`, `width?` |
| `SegBtn` | `Properties.jsx` | `opts: string[]`, `active: number`, `onChange` |

### 3.4. Ícones

Recriar set Lucide-style em TSX. Lista mínima (do `Icons.jsx`):
`IconImage, IconFilm, IconSparkles, IconClapperboard, IconPause, IconType, IconFolder, IconClose, IconChevronDown, IconChevronRight, IconPlay, IconUpload, IconPlus, IconGrip, IconSearch, IconSettings, IconAlert, IconCheck, IconHand, IconMouse, IconMusic, IconMic, IconFileVideo, IconStop, IconRewind, IconForward, IconLayers, IconArrowLeft, IconScissors, IconWand`.

Padrão: `1.5px stroke`, `currentColor`, `viewBox 24 24`, prop `size = 16`.

> Avaliar usar `lucide-react` (já no projeto) com aliases ao invés de SVG manual — mais leve. Decisão final no início da implementação.

### 3.5. README do namespace

`src/components/glyph/README.md` documenta:
- Quando usar cada primitiva.
- Tabela de tokens (espelha master).
- Exemplo de import: `import { GlyphButton, IconPlus } from '@/components/glyph'`.
- Regra do acento único.

---

## 4. Critérios de aceite

- [ ] `globals.css` carrega tokens completos; `body.glyph-root` aplica fundo Midnight Indigo + texto Vanilla Cream.
- [ ] As 4 famílias variáveis carregam offline (`navigator.onLine = false` no devtools → fontes ainda renderizam).
- [ ] `<GlyphButton variant="primary">` renderiza amarelo `#E8B547` com texto `#1A1F33`.
- [ ] `<GlyphInput error="msg">` renderiza borda Bordeaux + msg mono Bordeaux abaixo.
- [ ] Foco em qualquer botão/input mostra ring amarelo `--accent-ring`.
- [ ] Tela atual do Dashboard (não reescrita) já aparece em palette nova (verificação visual).
- [ ] `npm run build` passa sem warning de fonte/CSS.
- [ ] Smoke test Fabric.js: criar texto com `fontFamily: 'Fraunces'` e verificar renderização correta no canvas.

---

## 5. TestSprite — TCs sugeridos

- `TC_DS_001`: app boot → fundo `#1A1F33`, texto `#F0E7D5`.
- `TC_DS_002`: GlyphButton primary clicável e dispara `onClick`.
- `TC_DS_003`: GlyphInput com erro mostra borda Bordeaux e mensagem.
- `TC_DS_004`: foco via Tab mostra ring amarelo em botão e input.
- `TC_DS_005`: nenhuma request de rede para `fonts.googleapis.com` no boot.

---

## 6. Riscos

- **Tailwind v4 + CSS vars**: garantir que `@theme inline` funciona com nossa versão. Se não, fallback para classes utility customizadas.
- **Fraunces opsz/SOFT/WONK** podem não render em todos navegadores antigos — Tauri webview é Chromium recente, OK; mas fallback `Iowan Old Style, Georgia, serif` está no token.
- **Bundle size**: 4 fontes variáveis ≈ 1.5–2MB. Aceitável para desktop. Compactar via woff2 já é máximo.

---

## 7. Saída

Ao final desta fase:
- Toda tela existente, sem ser tocada, **já aparece com palette + tipografia novas**.
- Primitivas prontas para serem usadas nas fases seguintes.
- `fixes/patch_notes.md` atualizado com "F1 Glyph DS Fundação".
