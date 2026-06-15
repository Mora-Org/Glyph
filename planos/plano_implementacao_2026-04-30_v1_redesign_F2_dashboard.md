# F2 — Dashboard + Modal Novo Projeto
Data: 2026-04-30 · Versão: 1.0
Parte do [Glyph Redesign Master](plano_implementacao_2026-04-30_v1_glyph_redesign_master.md)

**Depende de:** F1 (DS Fundação).
**Tamanho:** M (~1 dia).

Reescrita completa da tela de entrada. Hoje é um formulário centralizado simples. O alvo é um app shell editorial com rail de navegação, headline tipográfica forte, grid de cards de projeto com hero typography, e um modal de Novo Projeto com presets de resolução/fps + validação.

---

## 1. Objetivos

- Substituir `src/components/ui/Dashboard.tsx` por uma versão fiel ao protótipo.
- Implementar **Empty State** editorial ("Comece pelo silêncio.") quando não há projetos.
- Criar `NewProjectModal` com:
  - Campo nome com validação inline.
  - 4 presets de resolução (9:16, 16:9, 1:1, Custom) em grid.
  - 3 opções de fps (24, 30, 60) em segmented control.
- Wire-up com `projectStore` mantendo a lógica `createProject` existente.

---

## 2. Arquivos-alvo

### Modificar
- `src/components/ui/Dashboard.tsx` — reescrita completa.
- `src/store/projectStore.ts` — estender `createProject(name, { resolution, fps })` mantendo retrocompat (segundo arg opcional, default `{ resolution: '1920x1080', fps: 30 }`).

### Criar
- `src/components/ui/DashboardSidebar.tsx` — rail nav (Projetos · Importar · Configurações · Sobre).
- `src/components/ui/ProjectCard.tsx` — card com hero lettering Fraunces + nome + meta.
- `src/components/ui/NewProjectCard.tsx` — card "+ Novo Projeto" tracejado.
- `src/components/ui/EmptyDashboard.tsx` — empty state editorial.
- `src/components/ui/NewProjectModal.tsx` — modal com presets.
- `src/components/ui/ModalShell.tsx` — wrapper compartilhado (header + body + footer + dismiss). **Reutilizado em F6, F7, F8.**

### Remover
- Lógica antiga inline do form (substituída pelo modal).

---

## 3. Layout

```
┌───────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌────────────────────────────────────────┐   │
│ │ Glyph    │ │  PROJETOS · 5                          │   │
│ │ by Mora  │ │                          [+ Novo]      │   │
│ │          │ │  O respiro                             │   │
│ │ Projetos │ │  do ensaio visual.   ←Fraunces 48 it/y │   │
│ │ Importar │ ├────────────────────────────────────────┤   │
│ │ Config.  │ │  ┌─┐ ┌─┐ ┌─┐ ┌─┐                       │   │
│ │ Sobre    │ │  │+│ │A│ │B│ │C│  ← grid 16/11.5       │   │
│ │          │ │  └─┘ └─┘ └─┘ └─┘                       │   │
│ │ v0.6.0   │ │                                        │   │
│ │ Obsidian │ │                                        │   │
│ │ em breve │ │                                        │   │
│ └──────────┘ └────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

### 3.1. DashboardSidebar
- Largura 200px, `flex-shrink: 0`, border-right hairline.
- Wordmark "Glyph" com `y` em accent yellow, Fraunces 900 26px.
- "by Mora" mono uppercase 9px, tracking 0.12em, muted.
- Nav vertical: 4 items mono uppercase 11px. Item ativo tem `border-left: 2px solid var(--accent)` + `bg-surface`.
- Rodapé: `v0.6.0 · Core` + `Obsidian em breve` mono muted.

### 3.2. Header da Main
- Padding `32px 36px 20px`, border-bottom hairline.
- Esquerda: label mono "Projetos · 5" + headline Fraunces 900 48px com **segunda linha em itálico amarelo accent** ("do ensaio visual.").
- Direita: `<GlyphButton variant="primary">+ Novo Projeto</GlyphButton>`.

### 3.3. Grid
- `display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;`
- Primeiro item: `<NewProjectCard />` (tracejado).
- Demais: `<ProjectCard />` ordenados por mod desc.

### 3.4. ProjectCard

```
┌────────────────────────────┐
│  Respiro            ←Fraunces hero
│                            │  ratio 16:9, bg #15192A
│                  00:48     │  paper texture overlay
├────────────────────────────┤
│  Ensaio Verão 2026         │  Geist 13 600
│  2 dias atrás · 12 cenas   │  Geist Mono 9.5 muted
└────────────────────────────┘
```

Hero typography: Fraunces 900, `clamp(28px, 4.4vw, 56px)`, accent yellow se for "favorito" (futuro), itálico WONK em alguns para variar.

### 3.5. EmptyDashboard

- Centralizado verticalmente.
- Headline Fraunces 800 italic 36px: "Comece pelo silêncio.\nA primeira cena vem depois."
- Subtítulo mono uppercase: "Você ainda não criou nenhum projeto..."
- 2 botões: `<GlyphButton primary>+ Novo Projeto</GlyphButton>` + `<GlyphButton secondary>Importar Pasta</GlyphButton>`.

### 3.6. NewProjectModal

```
┌─ Novo Projeto ──────────────────  ✕
│   CONFIGURAÇÃO INICIAL
├──────────────────────────────────
│   NOME DO PROJETO
│   [______________________]
│   ⚠ O nome é obrigatório.   ←só se erro
│
│   RESOLUÇÃO BASE
│   [9:16] [16:9*] [1:1] [CSTM]
│   1080×1920 · 1920×1080 · etc
│
│   FRAME RATE
│   [24 fps] [30 fps*] [60 fps]
├──────────────────────────────────
│              Cancelar  Criar
```

- Largura 440px, centrado sobre overlay `rgba(10,13,26,0.72)`.
- Validation: trim no name; erro inline mono Bordeaux + borda Bordeaux no input.
- Preset ativo: borda yellow, label yellow, sublabel mono muted.
- "Criar" disabled enquanto invalido; ativa accent quando válido.

---

## 4. Store changes

```ts
// src/store/projectStore.ts
type ProjectInit = { resolution?: string; fps?: number };
createProject: (name: string, init?: ProjectInit) => void;
```

Persistência mantém schema atual + novos campos opcionais para compat.

---

## 5. Critérios de aceite

- [ ] Dashboard com >0 projetos: rail + headline + grid renderizam fiel ao mock.
- [ ] Dashboard vazio: empty state editorial centralizado, 2 CTAs.
- [ ] "Novo Projeto" abre modal centrado em backdrop semi-transparente.
- [ ] Submit com nome vazio mostra erro mono Bordeaux + borda vermelha.
- [ ] Submit com nome válido cria projeto com resolução + fps escolhidos e navega para Editor.
- [ ] Apenas **uma** ocorrência de yellow accent por estado de tela (CTA primário OU item nav ativo, nunca ambos).
- [ ] ESC fecha modal; clique fora do conteúdo fecha modal.
- [ ] Foco visível ring yellow em todos os controles do modal.

---

## 6. TestSprite — TCs

- `TC_DSH_001`: dashboard com projetos lista cards com nome, duração, cenas.
- `TC_DSH_002`: empty state aparece quando store vazia.
- `TC_DSH_003`: clique em "+ Novo Projeto" abre modal.
- `TC_DSH_004`: submit modal vazio mostra erro inline.
- `TC_DSH_005`: submit válido fecha modal e navega para Editor.
- `TC_DSH_006`: preset de resolução ativo destacado em yellow.
- `TC_DSH_007`: ESC fecha modal sem criar projeto.
- `TC_DSH_008`: clique em rail "Configurações" navega para `/settings` (placeholder até F8).

---

## 6b. Extras — ProjectCard states (Extras.jsx · 2026-04-30)

Três variantes visuais definidas no bundle:

| Estado | Visual |
|---|---|
| Default | `bg-surface`, `border hairline`, sem shadow |
| **Hover** | `border: 1px solid accent`, `translateY(-2px)`, shadow `0 8px 24px -8px rgba(0,0,0,0.5)` + ring `0 0 0 3px rgba(232,181,71,0.12)`, gradient overlay sobre thumbnail, botões "Abrir" (accent) + cópia + "···" menu visíveis |
| Focus (teclado) | `box-shadow: 0 0 0 2px bg-deep, 0 0 0 4px accent` (ring duplo) |

Hover mostra: gradiente `linear-gradient(180deg, transparent 40%, rgba(13,16,32,0.7) 100%)` sobre thumbnail + CTA "Abrir" amarelo + botão duplicar frosted-glass.

Implementar com CSS hover state (`:hover`) + `transition: all 120ms var(--ease-editorial)`. Focus com `:focus-visible`.

---

## 7. Riscos

- **MOCK_PROJECTS** do bundle não tem thumb real; nosso store também não. Solução nesta fase: gerar hero typography a partir do nome do projeto (primeira palavra, ou `name.slice(0,8)`).
- **Importar Pasta** ainda não tem backend Tauri. Botão fica visualmente presente mas exibe toast "Em breve" até feature real (fora desta fase).

---

## 8. Saída

- Dashboard novo em produção visual.
- `ModalShell` reutilizável já criado para F6/F7/F8.
- Patch notes atualizado com "F2 Dashboard + Novo Projeto".
