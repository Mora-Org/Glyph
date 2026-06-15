# Patch Notes — PEG
Histórico de versões e aprendizados.

## v0.9.0 (2026-06-15) — F3: Editor Shell (Topbar + Sidebar) (Claude Code)

### Contexto
Verificação visual (Playwright) da F1 mostrou o Dashboard OK mas o Editor degradado: `Editor.tsx` **hardcodava** `bg-[#0a0a0a]`/`bg-[#080808]`, ignorando os tokens Indigo da F1 — baixo contraste, topbar inline sem hierarquia. F3 reescreve o shell externo do Editor (mantendo canvas/timeline/properties como caixas-pretas). Plano refinado por workflow de planejamento + revisão adversarial.

### Mudanças
- `src/components/ui/Topbar.tsx` (novo) — topbar editorial 40px: back (aria-label) · wordmark "Gl**y**ph" (Fraunces, `y` em `--accent`, opsz 28) · divisor hairline · nome do projeto (mono) · toggle Lettering (IconType) · `GlyphButton primary sm` Exportar. Hooks `data-testid` estáveis.
- `src/components/ui/EditorSidebar.tsx` (novo, ex-`AssetSidebar`) — `aside` 224px `bg-deep` com TabBar de 4 abas. `files`+`activeMediaId` mantidos no nível da sidebar (sobrevivem à troca de aba). Folder picker + drag `application/peg-asset` preservados 1:1.
- `src/components/ui/sidebar/` (novo) — `TabBar` (aba ativa border-bottom accent), `SearchInput`, `MediaTab` (item ativo = border-left accent), `FontsTab` (Fraunces/Geist/Geist Mono com "Aa" na própria fonte), `EffectsTab` (tremor/neon/ticker), `PausesTab` (black/vhs/static com texturas inline).
- `src/components/ui/EditorShell.tsx` (novo) — `glyph-root` coluna → Topbar + linha `[Sidebar 224 | main flex-1 min-w-0 overflow-hidden | properties=null]` com `min-h-0`.
- `src/components/ui/Editor.tsx` — usa `EditorShell`; matte do canvas → `--bg-surface`; `canvasRef`/LetteringPanel/ElementTimeline/SceneList/ExportModal preservados. Removidos todos os `#0a0a0a`/`#080808`/`white/8`/emojis.
- `src/components/ui/AssetSidebar.tsx` — removido (substituído por EditorSidebar).

### Verificação
- Playwright: header Indigo `rgb(26,31,51)`, Exportar accent `rgb(232,181,71)`, aba ativa border-bottom accent, Lettering `aria-pressed` + `bg-elevated`, Export modal abre, back→Dashboard. **Zero erros de console.**
- `tsc --noEmit`: nenhum erro novo (só os 3 pré-existentes do Fabric em `frameExporter.ts`).

### Aprendizados
- **Janela de não-compilação:** renomear (`git mv`) um componente ainda importado quebra o build entre passos. Solução: criar o substituto como arquivo novo e deletar o antigo só após migrar todos os consumidores.
- **Estado em abas que desmontam:** `files`/seleção precisam viver no pai (EditorSidebar), não na aba — senão somem ao alternar.
- **Acento amarelo "1x por tela":** interpretado por região (wordmark-`y` é marca/identidade, isento; ≤1 estado-de-ação por região). Removidos accents gratuitos (ex.: `i===0` estático no EffectsTab). Pendente aprovação visual do Boss.
- **Contrato Fabric:** `min-w-0 + overflow-hidden` no `<main>`/`<section>` impede o canvas fixo de 1280px estourar o layout.

## v0.8.1 (2026-06-05) — Reordenação de cenas acessível por teclado (Claude Code)

### Contexto
Triagem das 5 falhas do TestSprite (suíte de 02/jun) confirmou que **nenhuma é bug do app**:
- **TC002 / TC006** — bloqueadas pelo ambiente (runtime não forneceu caminho de arquivo para upload).
- **TC004** — teste inválido: referencia uma "pricing page" em `http://localhost/Taktimize/`, app inexistente neste projeto (alucinação do gerador).
- **TC007 / TC012** — limitações de automação: ambas as features funcionam, mas o harness headless não consegue dirigi-las (dnd exige movimento real de ponteiro; handle de trim de 12px é difícil de focar).

Investigando o TC007, identifiquei uma **lacuna de acessibilidade real**: a reordenação de cenas só tinha `PointerSensor`, sem caminho por teclado.

### Mudanças
- **`SceneList.tsx` — `KeyboardSensor` adicionado** ao `@dnd-kit` junto ao `PointerSensor`, usando `sortableKeyboardCoordinates` como `coordinateGetter`. Agora a reordenação de cenas/pausas é possível por teclado (focar a alça de drag → `Space` ativa → setas movem → `Space` solta). Os handles já recebem `tabIndex`/`role` via `{...attributes}` do `useSortable`, então tornam-se focáveis automaticamente. Benefício duplo: acessibilidade + a feature passa a ser automatável por QA headless.

### Validação
- `tsc --noEmit`: sem erros novos (mantêm-se apenas os 3 erros pré-existentes de tipos do Fabric.js em `frameExporter.ts:137-139`).

### Aprendizados
- Falha de QA headless em drag-and-drop `@dnd-kit` quase sempre é limitação do harness (precisa de eventos de ponteiro reais), **não** bug — mas é um bom gatilho para checar se existe caminho de teclado equivalente. Adicionar `KeyboardSensor` resolve a acessibilidade e destrava a automação de uma só vez.
- Antes de tratar uma falha de teste como bug, validar a origem: TC004 ("Taktimize"/pricing) era ruído do gerador de testes, não do produto.

---

## v0.8.0 (2026-06-02) — Fase 7 v2b: Integração Playhead & Ruler (Claude Code)

### Contexto
Os componentes `Playhead`, `GlobalRuler`, `TimelineConstants` e `timeHelpers` existiam no disco mas a integração estava com bugs. Esta entrega fecha a v2b da Fase 7.

### Mudanças
- **Bug — render duplicado:** `AudioTrackArea` era renderizado 2× (dentro do `SceneList` e de novo no `Editor.tsx`). Removido o do `Editor`; o `SceneList` é a fonte única da timeline.
- **`AudioTrackArea` dividido em dois:** `AudioTrackLabels` (coluna gutter fixa: nome/controles/add arquivo/remover) e `AudioTrackLanes` (eixo de tempo: só os blocos, posicionados por `startTime × escala`). Necessário para alinhar áudio às cenas no mesmo eixo de tempo.
- **`SceneList` reestruturado** em duas colunas: **gutter fixo** (transporte + label "Cenas" + `AudioTrackLabels`) e **coluna de tempo scrollável** (`#global-timeline-area`) que empilha `GlobalRuler → cenas → AudioTrackLanes → Playhead`, todos com `width = total × PIXELS_PER_SECOND` e alinhados em `x=0 = t=0`.
- **`TransitionBadge` agora flutua** sobre a junção das cenas com largura 0 no fluxo — antes consumia largura horizontal e desalinhava a régua/playhead das cenas.
- **Transporte play/pause** (`Play`/`Pause` no gutter): loop `requestAnimationFrame` que avança `currentTime` via `seekTo` em tempo real e move o playhead; para ao fim da duração total; reinicia do zero se acionado no fim. O `useEffect` de sync do `Editor` troca a cena ativa conforme o playhead cruza as fronteiras.
- **Constantes centralizadas** em `TimelineConstants.ts` (`GUTTER_WIDTH`, `RULER_HEIGHT`, `SCENE_LANE_HEIGHT`); `Playhead` e `GlobalRuler` deixaram de usar `PIXELS_PER_SECOND = 40` hardcoded e importam a constante.

### Validação
- `tsc --noEmit`: sem erros novos (mantêm-se apenas os 3 erros pré-existentes de tipos do Fabric.js em `frameExporter.ts:137-139`, que não afetam o build).
- `next build`: ✓ compilado em ~3.4s, static export gerado.
- **Verificação visual (Playwright headless, viewport 1440×900):** ✓ criado projeto → 3 cenas → trilhas VO/BGM → upload de áudio → play. Confirmado: régua, cenas, lanes de áudio e playhead todos alinhados no eixo de tempo (x=0 = t=0); bloco de áudio de 10s fiel à régua; badges CUT flutuando nas junções sem deslocar o eixo; transporte avançou `currentTime` 0.0 → 1.7s com playhead se movendo sobre as cenas; **0 erros de console**.
- **TestSprite** (suíte de regressão legada, dev mode, 15 testes): **10/15 aprovados (66,67%)**. Nenhuma falha é regressão da v2b — TC001 (entrar no Editor/timeline), TC003 (cenas), TC011 (toggle CUT/FADE → badges absolutos) e as 3 pausas passaram. As 5 falhas são: 2 bloqueadas por ambiente (upload sem arquivo: TC002/TC006), 1 caso inválido (TC004 referencia app "Taktimize"/pricing inexistente), 2 limitações de automação drag/teclado (TC007 dnd reorder, TC012 handles de trim — componentes não modificados nesta fase). Relatório: `testsprite_tests/testsprite-mcp-test-report.md`.
- **Lacuna conhecida:** a suíte legada não cobre os recursos de áudio da v2b (VO/BGM, transporte, playhead) — validados por Playwright; regenerar o test plan com casos de áudio é recomendado.

### Aprendizados
- Para alinhar trilhas heterogêneas (cenas, régua, áudio) num único eixo de tempo, o padrão correto é separar **gutter de labels** (coluna fixa) da **coluna de tempo** (scroll). Embutir o gutter dentro de cada trilha (como o `AudioTrackArea` original fazia com `w-32` interno) quebra o alinhamento.
- Loop de animação que escreve no store deve ler o estado fresco via `useProjectStore.getState()` dentro do `requestAnimationFrame`, com `useEffect` dependente só de `isPlaying` — senão cada `seekTo` reinicia o efeito e o loop trava.
- Elementos entre itens de um flex (badges) devem ter largura 0 + conteúdo `absolute` quando o eixo precisa permanecer fiel ao tempo.

---

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

---

## v0.7.0 (2026-04-30) — F1: Fundação Glyph DS (Redesign Editorial)

### Mudanças
- `src/app/globals.css` — reescrita completa para Glyph Design System: tokens Midnight Indigo/Vanilla Cream/yellow accent, @font-face (Fraunces var + Geist var + Geist Mono var), @theme inline bridge Tailwind, classes semânticas (.glyph-display-xl/l/m, .glyph-h1/2/3, .glyph-label, .glyph-mono, .glyph-data), scrollbar, paper texture, keyframes (tremor/neon/vibration).
- `public/fonts/` — 4 fontes variáveis self-hosted: Fraunces (normal+italic TTF), Geist (woff2), Geist Mono (TTF). Offline-first para Tauri.
- `src/app/layout.tsx` — removidos Google Fonts; adicionados `<link rel="preload">` para Geist/Fraunces; `className="glyph-root"` no body.
- `src/components/glyph/GlyphButton.tsx` — variantes primary/secondary/ghost/danger, tamanhos sm/md/lg, hover+disabled via inline styles, `ease-editorial`.
- `src/components/glyph/GlyphInput.tsx` — label mono uppercase, focus ring accent, erro inline bordeaux.
- `src/components/glyph/Toggle.tsx` — 26×14px pill accent, knob com transição 120ms.
- `src/components/glyph/Slider.tsx` — track 2px + fill accent + knob 8px, input range oculto.
- `src/components/glyph/Swatch.tsx` — swatch colorido com estado selected (double ring).
- `src/components/glyph/NumField.tsx` — drag scrub (ew-resize) + double-click edição, tabular-nums, clamp min/max.
- `src/components/glyph/SegBtn.tsx` — segmented control genérico, ativo com bg-elevated + accent.
- `src/components/glyph/Icons.tsx` — 43 ícones Lucide-style (1.5px stroke, currentColor, prop size), incluindo novos: IconInfo, IconCopy, IconTrash, IconLock, IconEye, IconExternal, IconLink.
- `src/components/glyph/index.ts` — barrel export de todos os primitivos.

### Aprendizados
- Fontes variáveis (opsz/SOFT/WONK no Fraunces) precisam de `font-variation-settings` explícito para expressar a estética editorial — padrão browsers ignora eixos customizados.
- NumField com drag scrub precisa de `window.addEventListener` (não element) para capturar mouse fora da área do componente ao arrastar rápido.
- Build Next.js clean (3.2s Turbopack) confirma que mudanças de F1 não introduziram regressões.
