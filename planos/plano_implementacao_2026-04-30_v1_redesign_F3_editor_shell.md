# F3 — Editor Shell (Topbar + Sidebar)
Data: 2026-04-30 · Versão: 1.0
Parte do [Glyph Redesign Master](plano_implementacao_2026-04-30_v1_glyph_redesign_master.md)

**Depende de:** F1.
**Habilita:** F4 (Canvas+Properties), F5 (Timeline+SceneList), F6 (Lettering Studio), F7 (Export Modal).
**Tamanho:** M (~1 dia).

Reescreve a estrutura externa do Editor: barra de topo + sidebar de assets com tabs. O canvas, properties e timeline são mantidos como caixas-pretas nesta fase (recebem o novo wrapper sem mudar internamente).

---

## 1. Objetivos

- Criar `Topbar` editorial (wordmark + projeto + autosave indicator + Lettering toggle + Exportar).
- Reescrever `AssetSidebar` com 4 tabs (Mídia · Tipos · Efeitos · Pausas).
- Estabelecer o layout grid do Editor: `topbar (40px) | [sidebar 224 | main flex | properties 280]`.
- Wire básico para abrir Lettering Studio (F6) e Export Modal (F7) — apenas state hook, modais entregues nas fases respectivas.

---

## 2. Arquivos-alvo

### Modificar
- `src/components/ui/AssetSidebar.tsx` → renomear para `EditorSidebar.tsx` ou reescrever.
- `src/app/page.tsx` (ou onde o Editor é montado) — usar novo shell.

### Criar
- `src/components/ui/Topbar.tsx`
- `src/components/ui/EditorShell.tsx` — composição de Topbar + Sidebar + main slot + Properties slot.
- `src/components/ui/sidebar/MediaTab.tsx`
- `src/components/ui/sidebar/FontsTab.tsx`
- `src/components/ui/sidebar/EffectsTab.tsx`
- `src/components/ui/sidebar/PausesTab.tsx`
- `src/components/ui/sidebar/TabBar.tsx` (reutilizável)
- `src/components/ui/sidebar/SearchInput.tsx`

### Não tocar nesta fase
- `useFabricCanvas`, `SceneList`, `ExportModal` (legado) — recebem novo CSS via tokens mas estrutura segue.

---

## 3. Topbar

Layout: 40px altura, border-bottom hairline, padding `0 14px`, gap 16px.

**Esquerda** (gap 14):
- (opcional) `<IconArrowLeft>` voltar para Dashboard.
- Wordmark "Glyph" Fraunces 900 18px, `y` em accent yellow.
- Divisor vertical 1×14px hairline.
- `projectName` Geist Mono 11px, secondary.
- Autosave indicator: dot 4px sage `--success` + `salvo · 14:32` mono uppercase 9px muted.

**Direita** (gap 8):
- Botão Lettering: outline border, mono 11px, `<span Fraunces>✦</span> Lettering`. Ativo quando aberto: bg `bg-elevated` + texto primary.
- `<GlyphButton variant="primary" size="sm">Exportar</GlyphButton>`.

API:
```tsx
<Topbar
  projectName="Ensaio Verão 2026"
  lettering={isLetteringOpen}
  onLettering={() => setLettering(true)}
  onExport={() => setExport(true)}
  onBack={() => router.push('/')}
  autosave="salvo · 14:32"
/>
```

---

## 4. EditorSidebar

Largura 224px, fundo `bg-deep`, border-right hairline.

### 4.1. TabBar
4 tabs equally distributed: Mídia · Tipos · Efeitos · Pausas. Mono 9.5px uppercase tracking 0.12em. Tab ativa: cor primary + border-bottom 1px accent yellow.

### 4.2. MediaTab
- Header inline: "7 itens" mono muted + botão `[📁 Pasta]`.
- Lista vertical scroll: ícone tipo + nome arquivo + tamanho. Item ativo: bg `bg-elevated` + border-left 2px accent + ícone yellow.
- Ícones por tipo: `IconImage / IconFilm / IconSparkles` (gif).
- Drag cursor `grab` (preparação F4 para drop no canvas).

### 4.3. FontsTab
- SearchInput mono no topo.
- Lista de fonts: thumb 28×28 com "Aa" na própria fonte + nome + `kind · tag`.
- Mock inicial: Fraunces, Geist, Geist Mono, + slots vazios para fontes user-import (futuro).

### 4.4. EffectsTab
- Lista vertical de cards `bg-surface`. Cada card: ícone Sparkles + nome + descrição (`0.8s · loop`).
- Primeiro item destacado em accent (preview visual).

### 4.5. PausesTab
- Header mono muted "Blocos de respiro".
- Cards 36×36 thumb + label mono + duration. Tipos: `black`, `vhs`, `static`. Texturas geradas via gradient inline (ver `Sidebar.jsx`).

---

## 5. EditorShell

```tsx
function EditorShell({ children, properties }) {
  return (
    <div className="glyph-root flex flex-col h-screen w-screen">
      <Topbar {...} />
      <div className="flex flex-1 min-h-0">
        <EditorSidebar />
        <main className="flex-1 flex flex-col min-w-0">{children}</main>
        {properties}
      </div>
    </div>
  );
}
```

Nesta fase, `children` continua sendo o Canvas+Timeline legados (sem reescrita); `properties` é placeholder até F4.

---

## 6. Critérios de aceite

- [ ] Topbar renderiza wordmark com `y` amarelo, projeto centro-esquerda, dot sage de autosave.
- [ ] Lettering toggle muda visual entre ativo/inativo.
- [ ] Exportar abre o ExportModal legado (F7 reescreve depois).
- [ ] Sidebar com 4 tabs muda conteúdo ao clicar; tab ativa tem border-bottom yellow.
- [ ] MediaTab seleciona item ao clicar (state local), mostra border-left yellow.
- [ ] Editor não regride: timeline e canvas atuais continuam funcionais visualmente (palette nova já aplicada via F1).

---

## 7. TestSprite — TCs

- `TC_EDS_001`: Editor abre com Topbar mostrando nome do projeto.
- `TC_EDS_002`: clique em "Exportar" abre o modal de exportação.
- `TC_EDS_003`: clique em "Lettering" toggla state visual.
- `TC_EDS_004`: clique em "← back" volta para Dashboard.
- `TC_EDS_005`: tabs do sidebar alternam conteúdo.
- `TC_EDS_006`: item de mídia selecionado destaca com border yellow.

---

## 8. Riscos

- **Compatibilidade** com `useFabricCanvas` existente: o shell não deve quebrar refs/dimensions do Fabric. Garantir que `<main>` mantém `min-w-0; flex-1; overflow: hidden`.
- **Drag-and-drop** entre Sidebar e Canvas é F4 — nesta fase só `cursor: grab` visual.

---

## 9. Saída

- Topbar + Sidebar novos visíveis.
- Editor herda DS sem regressão funcional.
- Hooks (`onExport`, `onLettering`) prontos para F6/F7 conectarem modais reais.
