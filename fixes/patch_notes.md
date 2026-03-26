# Patch Notes — PEG
Histórico de versões e aprendizados.

## v0.1.0 (2026-03-26)
### Mudanças
- Inicialização da estrutura de pastas modular (Next.js + Tauri).
- Criação do Product Specification Document (PSD).
- Definição do guia da equipe de programação.
- Configuração de fluxos de planejamento (`planos/`) e correções (`fixes/`).

### Aprendizados
- A estrutura modular facilita a transição de tarefas entre o planejamento (Antigravity) e a programação (Claude Code).
- O uso de FFmpeg via Tauri requer uma ponte robusta de comandos no backend Rust.

---

## v0.2.0 (2026-03-26) — Fase 0 + Fase 1 (Claude Code)
### Mudanças
- `npm install` — todas as dependências instaladas (Next.js, Fabric.js, Zustand, @dnd-kit, TypeScript).
- `tsconfig.json` criado com path alias `@/*` → `./src/*`.
- `next.config.ts` configurado com `output: 'export'` para Tauri (static export).
- `postcss.config.js` atualizado para `@tailwindcss/postcss` (Tailwind v4).
- `src/app/globals.css` reescrito com `@import "tailwindcss"` e `@theme {}` (v4 API).
- `src/app/layout.tsx` criado com metadados do app.
- `src/store/projectStore.ts` — Zustand store completo com persistência local:
  - Tipos: `Scene`, `SceneElement`, `ActivePause`, `TimelineItem`, `Project`
  - Suporte a `TransitionType` (cut/fade) e `PauseType` (black/vhs/solid)
  - CRUD completo de cenas, elementos e pausas na timeline
- `src/components/ui/Dashboard.tsx` — tela de criação de projeto.
- `src/components/ui/Button.tsx` e `Input.tsx` — componentes de UI base.
- `src/app/page.tsx` — redireciona para Dashboard ou Editor conforme estado do projeto.

### Aprendizados
- Next.js 16 usa Turbopack por padrão; `tailwindcss` como plugin PostCSS direto não funciona mais — usar `@tailwindcss/postcss`.
- Tailwind v4 não usa `tailwind.config.ts`; a configuração de tema vai no `globals.css` com `@theme {}`.
- `output: 'export'` no `next.config.ts` é obrigatório para o Tauri carregar o frontend como arquivos estáticos.
- **Rust instalado** — rustc 1.94.1. `tauri init` executado com sucesso.

---

## v0.3.0 (2026-03-26) — Fase 0 completa (Claude Code)
### Mudanças
- `tauri init` executado — `src-tauri/` totalmente configurado (Cargo.toml, tauri.conf.json, main.rs, lib.rs, ícones).
- `tauri.conf.json` ajustado: identifier `com.peg.app`, janela 1440×900.
- `src-tauri/src/lib.rs` — comando `greet` implementado e registrado via `invoke_handler`.
- `src/hooks/useTauri.ts` — wrapper `tauriInvoke` seguro (fallback mock em browser sem Tauri).
- `cargo check` executado e compilado com sucesso — bridge JS↔Rust validada.
- `cargo-tauri` instalado globalmente via `cargo install tauri-cli` (background task).

---

## v0.6.0 (2026-03-26) — Fase 4: Tipografia & GIFs (Claude Code)
### Mudanças
- `gifler` instalado para animação de GIFs no canvas.
- `src/types/gifler.d.ts` — declaração de tipos para o gifler (sem @types oficial).
- `src/store/projectStore.ts` — `SceneElement` estendido com: `fontFamily`, `fontSize`, `fill`, `isLetterChar`, `animationEffect`.
- `src/utils/parsers/lettering.ts`:
  - `splitTextToChars()` — divide texto em chars individuais preservando kerning via `measureText`
  - `createTextElement()` — factory de elemento de texto com defaults
- `src/hooks/useFabricCanvas.ts`:
  - `addGif()` — usa gifler para renderizar GIF animado frame-a-frame no canvas via `requestAnimationFrame`
  - `addText()` — cria `IText` editável, sincroniza texto com store via `editing:exited`
  - `setElementEffect()` — troca efeito de animação em objetos existentes no canvas
  - Efeito **Tremor**: offset X/Y aleatório a ~25fps
  - Efeito **Neon**: flicker de opacidade com função seno + ruído aleatório
  - Efeito **Ticker**: move texto horizontalmente em loop
- `src/components/canvas/MainCanvas.tsx` — refatorado com `forwardRef` + `useImperativeHandle` para expor `addText` e `setEffect` ao Editor
- `src/components/typography/LetteringPanel.tsx`:
  - Toggle de fonte, tamanho (slider), cor (color picker)
  - Seleção de efeito de animação (Tremor, Neon, Letreiro)
  - Botão "Split em letras individuais"
- `src/components/ui/Editor.tsx` — botão "✦ Lettering" no header abre/fecha painel lateral

### Aprendizados
- `gifler` não tem tipos — necessário criar `.d.ts` manual em `src/types/`.
- `forwardRef` + `useImperativeHandle` é o padrão correto para expor métodos imperativos de componentes canvas ao componente pai.

---

## v0.5.0 (2026-03-26) — Fase 3: Cenas, Timeline e Pausas (Claude Code)
### Mudanças
- `@dnd-kit/sortable` e `@dnd-kit/utilities` instalados.
- `src/components/timeline/SceneList.tsx` — lista de cenas reordenável:
  - Drag & drop via `@dnd-kit` (PointerSensor com threshold de 6px)
  - Mostra cenas e pausas ativas na ordem da timeline
  - Menu "＋ Pausa" com opções: Tela Preta, VHS, Cor Sólida
- `src/components/timeline/TransitionBadge.tsx` — badge clicável entre cenas para alternar CUT/FADE.
- `src/components/canvas/ActivePauseCanvas.tsx` — preview visual das pausas:
  - Tela preta: canvas preto sólido
  - VHS: ruído estático animado com `requestAnimationFrame` + scanlines + glitch
  - Cor sólida: canvas com cor configurável
- `src/components/timeline/ElementTimeline.tsx` — tracks por elemento:
  - Drag nos handles esquerdo/direito para ajustar startTime/endTime
  - Labels coloridos por tipo (IMG/VID/GIF/TXT)
  - Régua de tempo com marcações em segundos
- `src/components/ui/Editor.tsx` atualizado:
  - Integração de SceneList, ElementTimeline e ActivePauseCanvas
  - Transição FADE implementada via animação de opacidade (0 → 1 em 300ms)
  - Transição CUT: troca imediata sem animação

### Aprendizados
- `@dnd-kit/sortable` e `@dnd-kit/utilities` são pacotes separados do `@dnd-kit/core` — instalar explicitamente.
- A animação de fade deve aplicar `transition: none` no momento que opacity vai a 0, para evitar interpolação inversa.

### Aprendizados
- O PATH do Rust não é atualizado na sessão atual após instalação — usar o caminho completo `~/.cargo/bin/` ou reiniciar o terminal.
- `@tauri-apps/cli` no npm permite rodar `npx tauri init` sem instalar o `cargo-tauri` separadamente.

---

## v0.4.0 (2026-03-26) — Fase 2: Motor do Canvas (Claude Code)
### Mudanças
- `src/hooks/useFabricCanvas.ts` — hook de inicialização segura do Fabric.js:
  - Canvas inicializado via import dinâmico (evita SSR crash)
  - Sincronização automática de transform com o Zustand store via `object:modified`
  - `addImage` — carrega `.png`/`.jpg` como `FabricImage`
  - `addVideo` — carrega `.mp4`/`.mov` via `<video>` e renderiza frame-a-frame com `requestAnimationFrame`
  - Handles de transformação customizados (estética PEG): círculos brancos, borda tracejada
- `src/components/canvas/MainCanvas.tsx` — componente do canvas:
  - Drop de arquivos direto no canvas (imagem e vídeo)
  - Overlay de drop quando cena estiver vazia
  - Recarrega elementos ao trocar de cena
- `src/components/ui/AssetSidebar.tsx` — sidebar de assets:
  - Seleção de pasta local (webkitdirectory)
  - Filtro automático por extensão (imagens, vídeos, GIFs)
  - Drag & drop de arquivos para o canvas
- `src/components/ui/Editor.tsx` — layout completo do editor:
  - Header com nome do projeto e botão de exportar
  - Canvas central
  - Barra de cenas na base com navegação e criação de novas cenas
- `src/app/page.tsx` — roteamento Dashboard/Editor simplificado

### Aprendizados
- Fabric.js v6 mudou o cast de tipos — usar `as unknown as T` para propriedades customizadas em objetos Fabric.
- `FabricImage` com elemento `<video>` precisa de re-render manual via `requestAnimationFrame` — não atualiza automaticamente.
