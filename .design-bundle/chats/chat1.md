# Glyph Visual Essays

_Started 2026-04-30 01:02 UTC_

---

## User

# Glyph — Brief do Produto

## O que é o Glyph

Glyph é um app DESKTOP open-source (Tauri + Next.js, build estático)
para criação de **ensaios visuais com lettering dinâmico**. Não é
editor de vídeo linear: é ferramenta de autoria onde tipografia,
composição estética e ritmo são protagonistas.

Output: vídeos curtos (.mp4 / .mov) renderizados via FFmpeg.
Plataformas-alvo: Windows e Linux.
Filosofia: do manifesto Mora — "estética da profundidade",
"tecnologia com alma", "pausa necessária para a profundidade".

## Estratégia de produto

Duas edições compartilhando o mesmo core visual:
- **Glyph Core** — leve, estável, sem IA. Foco neste brief.
- **Glyph Obsidian** — versão pesada com VOID Engine (AI video
  inpainting). Requisito 12GB+ VRAM. Fora do escopo agora — apenas
  reservar slot no menu/about indicando "Obsidian Edition" futura.

---

## Telas a desenhar (escopo completo)

### 1. Dashboard (entry point)
- Lista de projetos recentes (cards com thumbnail da primeira cena,
  nome, data de modificação, duração total)
- Botão CTA "Novo Projeto" (abre modal de criação com campo nome
  obrigatório, preset de resolução, fps)
- Empty state quando não há projetos (estado tipográfico forte,
  convidativo, no espírito Mora)
- Menu lateral discreto: Projetos · Importar · Configurações · Sobre
- Indicador de versão Glyph (Core / Obsidian) no rodapé

### 2. Editor (tela principal — densa, 4 áreas)

**Layout AppShell:**

## Assistant

Vou começar explorando o design system Glyph e fazendo algumas perguntas para entender melhor o escopo.

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: list_files]_

Excellent — already have the Glyph DS in hand. The user provided a UI kit recreation already exists. Let me look at the existing recreation to see if I can fork from it, and decide on a presentation strategy.

_[tool: read_file]_

_[tool: read_file]_

There's already a UI kit recreation. Let me look at the actual components and screenshots to understand what exists, then plan whether to fork or extend. The brief asks for screens beyond what's in the kit (Lettering Studio, New Project modal, Settings, empty/error states). Best path: fork the existing app, then add the missing screens, presented via design_canvas so the user can see all variations side-by-side.

Let me read the key existing components first.

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

I have a strong foundation. The existing UI kit covers Dashboard, Editor, Export Modal. The brief asks for additional screens: **Lettering Studio**, **New Project Modal**, **Settings**, and explicit **states** (empty, loading, error). Best approach: build a single design canvas with all screens as artboards so the user sees the full system.

Let me set up. I'll copy the existing kit, then add the missing screens.

_[tool: update_todos]_

_[tool: snip]_

_[tool: copy_files]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

Now I need to fix the CSS path in the copied file (it references `fonts/` not `ds/fonts/`), and add a few more icons we'll need. Let me also extend Icons.jsx for things we'll add.

_[tool: read_file]_

Font paths are relative to the CSS file, so `fonts/` works from `ds/colors_and_type.css`. Good. Now let me build the icons, components, and main file.

_[tool: write_file]_

_[tool: snip]_

Now let me build the editor screen and dashboard. I'll write a polished, refined version that follows the brief while inheriting from the design system.

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: update_todos]_

_[tool: done]_

_[tool: snip]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

Pronto — Glyph Telas.html cobre dashboard, editor, lettering studio, export (idle/rendering), novo projeto, configurações e estados de erro/vazio, com tweaks para a cor de acento.

## User

Tenho um bundle de design que você mesmo criou pra mim (Glyph — app desktop Tauri+Next.js para ensaios visuais com lettering dinâmico). Vou implementar tudo agora com o Claude Code e preciso que você resolva os buracos antes que a gente comece.

O design cobre: Dashboard, Editor, Lettering Studio, Export Modal, Settings, Error. Está bom. O que falta:

1. Toast / notificações — como o app comunica "Projeto salvo", "Exportação concluída", erros não-críticos. Precisa de um componente visual (posição, variantes: success/error/info, duração).

2. Estados de hover nos Project Cards — o card escurece? aparece um botão "Abrir"? a border fica yellow?

3. Drag visual — quando o usuário arrasta um asset do sidebar pro canvas, como fica o fantasma de drag e a drop zone no canvas?

4. Settings → Editar — quando clica no botão "Editar" de uma row de configuração (ex: trocar o path do FFmpeg, trocar a cor de acento), o que abre? Um inline input? Um mini-modal?

5. Variante "About" — tela ou seção sobre o Glyph / Mora dentro de Settings. Só precisa de um layout — não precisa de texto real.

6. Loader de boot — enquanto o Tauri inicializa, o que o usuário vê? Pode ser uma splash simples.

7. Context menu — clicar com botão direito em um Scene Card ou elemento no canvas: quais ações aparecem e como fica o menu?

Mantém o mesmo DS (Midnight Indigo / Vanilla Cream / yellow accent / Fraunces + Geist + Geist Mono). Não precisa redesenhar o que já está bom — só preenche esses 7 buracos.

## Assistant

_[tool: list_files]_

_[tool: update_todos]_

_[tool: snip]_

_[tool: list_files]_

<I'll quickly check existing files I need to extend, then build the new components.>

_[tool: read_file]_

_[tool: read_file]_

<I'll add a few more icons, then build the missing pieces.>

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: write_file]_

<I'll snip the older completed phases and continue building.>

_[tool: snip]_

_[tool: read_file]_

<I'll snip older settled phases and add the new section to the canvas.>

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

<I need to add the helper components I referenced (ProjectCardDefault, ProjectCardFocus, CardLabel) and verify everything still works.>

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: update_todos]_

_[tool: done]_

<I'll snip and verify.>

_[tool: snip]_

_[tool: fork_verifier_agent]_

<I'll continue with delivery summary.>

Buracos preenchidos. Adicionei na seção **05 · Feedback & micro-estados** e **06 · Boot** no design canvas:

1. **Toasts** — 4 variantes (success/error/info/progress) num artboard isolado + 1 em contexto sobre o Dashboard, posição inferior-direita, com barra de acento lateral colorida, ações inline e progresso embutido.
2. **Project Card states** — três cards lado-a-lado: default, hover (border yellow + lift de 2px + halo + botão "Abrir" + ícone duplicar + menu ···), keyboard focus (anel duplo).
3. **Drag & drop** — Editor com dashed drop zone yellow sobre o canvas, ghost rotacionado -2° tracking do cursor, badge contador "1", hint "Soltar para adicionar à Cena 02".
4. **Settings inline edit** — duas variantes: edição de path do FFmpeg (input + procurar + status de detecção) e edição de cor de acento (swatches + hex + preview tipográfico). A row inteira vira o painel de edição.
5. **About** — tela completa: hero com headline em Fraunces, três pilares numerados (Lentidão, Tipografia viva, Soberania local), edições (Core/Obsidian), stack, links.
6. **Splash** — wordmark grande com `y` em yellow, subtítulo em Fraunces italic, barra de progresso com phase label e contador (1/5).
7. **Context menus** — dois: Scene Card (reproduzir, duplicar, renomear, dividir, inserir pausa, exportar cena, remover) e elemento de texto no canvas (lettering studio, editar, duplicar, ordem de camada, bloquear, ocultar, remover). Atalhos alinhados à direita, item destrutivo em vermelho, separadores.

Tudo respeita o DS — Midnight Indigo / Vanilla Cream / yellow accent / Fraunces + Geist + Geist Mono. Tweaks panel continua trocando a cor de acento em todas as telas.

## User

Verifier agent check completed

## Assistant

