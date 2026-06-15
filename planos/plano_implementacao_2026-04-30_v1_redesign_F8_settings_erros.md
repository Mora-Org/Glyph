# F8 — Settings + Erros
Data: 2026-04-30 · Versão: 1.0
Parte do [Glyph Redesign Master](plano_implementacao_2026-04-30_v1_glyph_redesign_master.md)

**Depende de:** F1 (e F2 para `ModalShell`).
**Tamanho:** M (~1 dia).

Cria a tela de Configurações (Aparência · FFmpeg · Pastas · Atalhos · Sobre) e o modal de Erro (FFmpeg ausente) com bloco de comando e ações de fix.

---

## 1. Objetivos

- Tela `/settings` (rota Next dedicada ou modal full-screen sobre o Editor).
- 4 grupos de configurações em cards `bg-surface` com rows label / valor / [Editar].
- Card "Edição" no rodapé com info Glyph Core + Obsidian em breve + link Manifesto Mora.
- Modal de erro reutilizável: ícone alert Bordeaux + título Fraunces + descrição + bloco de comando mono + 2 ações.

---

## 2. Arquivos-alvo

### Criar
- `src/app/settings/page.tsx` — rota Next.
- `src/components/ui/Settings.tsx` — composição.
- `src/components/ui/settings/SettingsSidebar.tsx`
- `src/components/ui/settings/SettingsGroup.tsx`
- `src/components/ui/settings/SettingsRow.tsx`
- `src/components/ui/settings/EditionCard.tsx`
- `src/components/ui/ErrorModal.tsx` — reutilizável (FFmpeg ausente, falha export, etc).
- `src/store/settingsStore.ts` — `appearance, ffmpeg, folders, shortcuts`.

---

## 3. Settings layout

```
┌──────────┬───────────────────────────────────
│ ← Voltar │  APARÊNCIA · FFMPEG · PASTAS · ATALHOS
│          │                                   
│ Config.  │  Como o Glyph respira em sua máq. ←Fraunces 40
│          │                                   
│ Aparência*│  ┌────────────────────────────┐
│ FFmpeg   │  │ APARÊNCIA                  │
│ Pastas   │  ├────────────────────────────┤
│ Atalhos  │  │ Modo            Dark   [Editar]│
│ Sobre    │  │ Light disponível, opt-in       │
│          │  ├────────────────────────────┤
│ v0.6.0   │  │ Densidade       Confortável│
│ Core     │  ├────────────────────────────┤
│          │  │ Acento     ■ #E8B547  [Edit]│
│          │  └────────────────────────────┘
│          │  ...mais cards...
│          │  ┌────────────────────────────┐
│          │  │ EDIÇÃO                     │
│          │  │ Glyph Core · v0.6.0        │
│          │  │ Glyph Obsidian · em breve  │
│          │  │              [Manifesto]   │
│          │  └────────────────────────────┘
```

### 3.1. SettingsSidebar
- Botão "← Voltar" mono uppercase 10.
- Wordmark "Configurações" Fraunces 900 22.
- Nav vertical de grupos. Item ativo: bg-surface + border-left yellow.
- Footer: `v0.6.0 · Core` mono muted.

### 3.2. Header da Main
- Pre-label mono uppercase listando os grupos.
- Headline Fraunces 900 40px com **palavra "Glyph"** em itálico amarelo accent.

### 3.3. SettingsGroup (card)
- `bg-surface` border hairline radius 6.
- Header: faixa mono uppercase (`APARÊNCIA`, `FFMPEG`, ...).
- Rows: `display: grid; grid-template-columns: 1fr auto auto;` (label / valor / [Editar]).
  - Label: Geist 13 primary.
  - Hint opcional mono 9.5 muted.
  - Valor: mono 11 OU sans 13 (depende da row); com Swatch quando cor; com IconCheck sage quando OK.
  - Botão [Editar]: outline mono 9.5 uppercase.

### 3.4. Grupos default

**Aparência:**
- Modo: `Dark` (accent yellow), hint "Light disponível, opt-in".
- Densidade: `Confortável`.
- Acento: swatch + `#E8B547`.

**FFmpeg:**
- Binário: path mono.
- Versão: `6.1.1 · auto-detectado` + IconCheck sage.
- Encoder: `NVENC (RTX 4070)` + hint "AMF e CPU disponíveis".

**Pastas padrão:**
- Assets: `~/Mora/Glyph/assets`.
- Exports: `~/Mora/Glyph/exports`.

**Atalhos:**
- Play/Pause: `Espaço`.
- Seleção · Texto · Pan: `V · T · H`.
- Shuttle: `J · K · L`.
- Duplicar · Remover · Undo: `Ctrl+D · Del · Ctrl+Z`.

### 3.5. EditionCard
- Pre-label mono uppercase "Edição".
- Display Fraunces 800 22: `Glyph Core · v0.6.0`.
- Sub mono: `Glyph Obsidian · em breve · VOID Engine · 12GB+ VRAM`.
- Botão direita: `<GlyphButton secondary>Manifesto Mora</GlyphButton>`.

---

## 4. ErrorModal

Reutilizável, props:
```ts
type ErrorModalProps = {
  variant?: 'ffmpeg-missing' | 'export-failed' | 'generic';
  title: string;        // override
  description: string;
  command?: string;     // bloco mono opcional
  primary?: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
  onClose: () => void;
};
```

### 4.1. Layout

```
┌─────────────────────────────
│  ⚠ FFMPEG NÃO ENCONTRADO   ← mono 10 Bordeaux
│  Glyph não conseguiu       ← Fraunces 800 26
│  localizar o FFmpeg na sua │
│  máquina.                  │
│                            │
│  Sem o FFmpeg, exportação..│  Geist 13 secondary
│                            │
│  ┌──────────────────────┐  │
│  │ $ sudo apt install ff│  │  bloco mono em bg-deep
│  └──────────────────────┘  │
├──────────────────────────────
│        Fechar  Definir caminho...
```

---

## 4b. Extras — SettingsInlineEdit + AboutScreen (Extras.jsx · 2026-04-30)

### SettingsInlineEditPath
Card `bg-surface` com borda `accent`, header "FFmpeg · editando" mono uppercase + "Esc para cancelar" muted à direita. Corpo: input mono com borda accent + botão "Procurar" (IconFolder) + verify check sage ao detectar versão. Footer: ghost + primary "Salvar".

### SettingsInlineEditColor
Card `bg-surface` borda accent. Header "Cor de acento · editando". Corpo: grid de 6 swatches circulares 32×32 (selecionado tem borda branca + ring accent) + input hex + preview Fraunces "Preview" com palavra accent em itálico. Footer: ghost + primary "Aplicar".

Implementação: o clique em "Editar" em uma row do SettingsGroup substitui a row por um card inline (não abre modal), com animação de altura 120ms.

### AboutScreen
Tela completa dentro do shell de Settings (mesmo sidebar, "Sobre" ativo). Seções:
1. **Hero**: pré-label mono, headline Fraunces 900 64px "O **respiro** entre o frame e o sentido" (accent + itálico secondary), paper texture.
2. **2 colunas**: esquerda — "Os três pilares" (Lentidão · Tipografia viva · Soberania local) com numerais accent 36px Fraunces. Direita — Edições card (Core/Obsidian) + Stack mono + Links (mora.studio, Manifesto, Changelog, Reportar erro).
3. **Footer**: "© 2026 Mora Studio · Brasil" + "Feito com **respiro** em Curitiba" (accent).

Criar:
- `src/app/settings/about/page.tsx` ou como sub-rota.
- `src/components/ui/settings/AboutSection.tsx`
- `src/components/ui/settings/SettingsInlineEditPath.tsx`
- `src/components/ui/settings/SettingsInlineEditColor.tsx`

---

## 5. Store

```ts
type SettingsStore = {
  appearance: { mode: 'dark' | 'light'; density: 'compact' | 'confortavel'; accent: string };
  ffmpeg: { binary: string; version: string; encoder: string };
  folders: { assets: string; exports: string };
  shortcuts: Record<string, string>;
  setAccent(hex: string): void;
  setEncoder(name: string): void;
  // ...
};
```

Persistência: `localStorage` ou `tauri-plugin-store` para sobreviver reload.

---

## 6. Critérios de aceite

- [ ] `/settings` carrega tela completa.
- [ ] Sidebar destaca grupo atual (scroll-based ou click-to-jump).
- [ ] Cards renderizam todas rows com valores reais da store.
- [ ] Botão "Editar" abre dialog (placeholder para fase futura, ok mostrar toast).
- [ ] Trocar accent na settings reflete em `--accent` runtime.
- [ ] ErrorModal "FFmpeg ausente" aparece automaticamente no boot se `tauri::ffmpeg_path()` retornar falha.
- [ ] Manifesto Mora abre link externo (a definir URL).
- [ ] ESC fecha ErrorModal.

---

## 7. TestSprite — TCs

- `TC_SET_001`: navegação Dashboard → Settings funciona.
- `TC_SET_002`: 4 grupos + EditionCard renderizam.
- `TC_SET_003`: trocar accent atualiza UI imediatamente.
- `TC_SET_004`: ErrorModal aparece se FFmpeg path inválido.
- `TC_SET_005`: bloco de comando do ErrorModal copia para clipboard ao clicar (nice-to-have).

---

## 8. Riscos

- **Acento dinâmico**: aplicar no `:root` em runtime requer CSS vars (já compatível via F1).
- **Persistência Tauri**: se `tauri-plugin-store` não estiver instalado, fallback para `localStorage` (web build) + sidecar JSON via comando Tauri (desktop).
- **Detecção FFmpeg**: comando Tauri `detect_ffmpeg()` precisa existir; se não existir, criar nesta fase ou postergar para fase backend.

---

## 9. Saída

- Tela de Settings completa.
- ErrorModal reusável em todo o app.
- Store de settings persistente.
