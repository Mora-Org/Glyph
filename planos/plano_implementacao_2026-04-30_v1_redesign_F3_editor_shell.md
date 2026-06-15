# F3 — Editor Shell (Topbar + Sidebar) · Plano Executável
Data: 2026-04-30 · Versão executável: 2026-06-15
Parte do [Glyph Redesign Master](plano_implementacao_2026-04-30_v1_glyph_redesign_master.md)

**Depende de:** F1 (primitivas + tokens). **Habilita:** F4, F5, F6, F7. **Tamanho:** M.

> Esta versão substitui o stub original. Todos os fatos foram confirmados lendo o código atual
> (recon validado via workflow de planejamento) e a ordem foi corrigida por revisão adversarial
> para garantir **compilação contínua** e **não-regressão** do canvas Fabric.

---

## 1. Escopo

**Muda (entorno do Editor):**
- `<header>` inline do `Editor.tsx` → componente `Topbar.tsx` editorial (back · wordmark Gl**y**ph · projeto · Lettering toggle · Exportar).
- Toggle **Lettering** sai do rodapé da sidebar → cluster direito da Topbar.
- `AssetSidebar` (emoji + `white/8`) → `EditorSidebar.tsx` com **TabBar de 4 abas** (Mídia · Tipos · Efeitos · Pausas).
- Invólucro `EditorShell.tsx`: `glyph-root` coluna → Topbar (40px) + linha `[Sidebar 224 | main flex-1 min-w-0 | properties slot]`.
- Eliminar fundos/bordas hardcoded (`#0a0a0a`, `#080808`, `white/8`) → tokens Indigo.

**NÃO se toca (caixa-preta):** `useFabricCanvas`, `MainCanvas`, `ActivePauseCanvas`, `ElementTimeline`,
`SceneList`, `LetteringPanel`, `ExportModal`. Properties (280px) é placeholder `null` (F4).
Canvas interno mantém `#000000` + handles brancos (não são "shell").

---

## 2. Ordem compile-safe (corrigida pela revisão)

> **Gap crítico evitado:** NÃO renomear `AssetSidebar.tsx` antes do `Editor.tsx` migrar (quebraria o
> import e o build). Criar `EditorSidebar.tsx` como **arquivo novo**; deletar `AssetSidebar.tsx` só no fim.

1. Criar componentes-folha (sem quebrar imports existentes): `sidebar/TabBar`, `sidebar/SearchInput`,
   `sidebar/MediaTab`, `sidebar/FontsTab`, `sidebar/EffectsTab`, `sidebar/PausesTab`.
2. Criar `Topbar.tsx`, `EditorSidebar.tsx` (novo), `EditorShell.tsx`.
3. Refatorar `Editor.tsx` para usar `EditorShell` (remove o import de `AssetSidebar` e mata os bg hardcoded).
4. Deletar `AssetSidebar.tsx` (agora órfão).
5. Verificação Playwright + auditoria de tokens.

---

## 3. Contrato de não-regressão (Fabric)
1. `<main>` e a `<section>` do canvas mantêm `flex-1 min-w-0 overflow-hidden`; a linha pai mantém `min-h-0`.
   (sem `min-w-0`, o canvas fixo de 1280px estoura sidebar/properties.)
2. Container imediato do canvas: `flex items-center justify-center overflow-hidden`; wrapper interno
   fixo 1280×720 intacto — escala é só CSS, não mexer em `setDimensions`.
3. Não tocar `canvasRef`/`fabricRef`/`useImperativeHandle` (`addText`/`setEffect`) nem `MainCanvasHandle`.
4. Matte do artboard passa a `var(--bg-surface)`; preto interno do canvas fica.
5. `SceneList`/`ElementTimeline`/`ActivePauseCanvas` na mesma ordem, abaixo do canvas.
6. Drag preservado: `dataTransfer 'application/peg-asset'` idêntico.
7. `ExportModal` montado no top-level do Editor (fora do shell), evitando clipping por `overflow-hidden`.

---

## 4. Ajustes da revisão adversarial (incorporados)
- **Acento amarelo ≤1 por região:** wordmark-`y` é **marca/identidade** (estático, isento). Cada região marca
  exatamente 1 estado ativo: Topbar→Exportar; TabBar→1 aba; MediaTab→1 item **só via border-left** (ícone
  volta a `--text-secondary`). Removido o accent estático `i===0` do EffectsTab. **Aprovação visual do Boss
  é bloqueante** antes de fechar a fase.
- **Autosave não hardcodado:** `autosave` omitido nesta fase (sem persistência real → não exibir "salvo").
- **Sem dingbats:** toggle Lettering usa `IconType` (não o glifo cru `✦`).
- **Wordmark `opsz` ~28** (não 144) no tamanho 18px.
- **Hooks de teste estáveis:** `aria-label`/`data-testid` em back, Exportar, Lettering, abas e itens de mídia.

---

## 5. Verificação
**Playwright (`npm run dev`):** dashboard Indigo → criar projeto → topbar (wordmark Gl**y**ph com `y` accent,
Exportar amarelo) → 4 abas alternando (border-bottom accent só na ativa) → item de mídia selecionado
(border-left accent) → Lettering ON (coluna aparece) → Export modal → back volta ao Dashboard.

**Auditoria estática:** Grep zera `#0a0a0a`, `#080808`, `bg-\[#`, `white/`, emojis/dingbats nos arquivos do shell.

**TestSprite (gate antes de fechar a fase):** TCs existentes que dependiam de `text=Assets` / xpath do
`<header>` / "+ Pasta" precisam ser **regenerados** pela QA (TC006/007/008/020/025). Os hooks `aria-label`/
`data-testid` novos permitem âncoras estáveis. Novos: `TC_EDS_001..006`.

---

## 6. Checklist
```
[ ] Editor.tsx sem #0a0a0a/#080808/white-8/text-white/emojis (Grep zera)
[ ] Topbar: back(aria-label) · Gl[y]ph (y=--accent, opsz~28) · divisor · projeto mono · Lettering(IconType) · Exportar(GlyphButton primary sm)
[ ] sidebar/TabBar: 4 cols, mono 9.5px uppercase tracking 0.12em, aba ativa border-bottom --accent
[ ] sidebar/{SearchInput,MediaTab,FontsTab,EffectsTab,PausesTab}
[ ] MediaTab: folder picker + drag 'application/peg-asset' preservados; ativo = border-left 2px --accent (ícone NÃO accent)
[ ] EditorSidebar: aside w-56 bg-deep; files+activeMediaId no nível da sidebar (não perde assets ao trocar aba); label "Tipos"
[ ] EditorShell: glyph-root flex-col → Topbar + linha [sidebar | main flex-1 min-w-0 overflow-hidden | properties=null], min-h-0
[ ] Editor usa EditorShell; canvasRef/LetteringPanel/ElementTimeline/SceneList/ExportModal preservados; matte = --bg-surface
[ ] Contrato Fabric ok; AssetSidebar.tsx deletado; app compila
[ ] Auditoria accent ≤1 por região (aprovação visual do Boss pendente)
[ ] Playwright: 7 screenshots OK
[ ] TestSprite regenerado e verde (QA)
```
