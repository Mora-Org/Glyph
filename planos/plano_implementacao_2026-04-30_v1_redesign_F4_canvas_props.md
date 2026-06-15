# F4 — Canvas + Properties
Data: 2026-04-30 · Versão: 1.0
Parte do [Glyph Redesign Master](plano_implementacao_2026-04-30_v1_glyph_redesign_master.md)

**Depende de:** F1, F3.
**Habilita:** F6 (Lettering Studio).
**Tamanho:** M (~1 dia).

Adiciona **chrome editorial** ao canvas existente (sem mexer no motor Fabric.js) e cria o painel `Properties` à direita com sliders, NumFields, segmented controls.

---

## 1. Objetivos

- Envolver o `<canvas>` Fabric com chrome: tool strip vertical (V/T/H), status bar superior, ruler opcional, paper texture overlay no fundo dos artboards de cena.
- Implementar Painel `Properties` à direita (280px), com 2 modos:
  - **Texto** (default quando elemento texto está selecionado).
  - **Cena** (quando nenhum elemento, mas cena ativa).
- Conectar com store: ler elemento selecionado, atualizar propriedades em tempo real (X/Y, fontSize, opacity, rotation, fill, fontWeight, tracking, leading).

---

## 2. Arquivos-alvo

### Modificar
- `src/components/canvas/CanvasArea.tsx` (ou equivalente) — wrapper com chrome.
- `src/hooks/useFabricCanvas.ts` — adicionar emissão de evento `onSelectionChange` para o store.
- `src/store/projectStore.ts` — campo `selectedElementId` + actions `selectElement(id)`, `updateElement(id, patch)`.

### Criar
- `src/components/canvas/CanvasChrome.tsx` — tool strip + status bar + ruler.
- `src/components/canvas/ToolStrip.tsx` — V/T/H com keybind labels.
- `src/components/canvas/CanvasStatusBar.tsx` — `02/05 · Cena · 1280×720 · Xs · X/Y · Z% · SNAP`.
- `src/components/canvas/Ruler.tsx` — top + left ruler com gradient `linear-gradient(to right, var(--border) 1px, transparent 1px) 40px`.
- `src/components/canvas/EmptyCanvas.tsx` — estado "Cena em branco".
- `src/components/properties/PropertiesPanel.tsx` — entry point, decide modo.
- `src/components/properties/PropTextMode.tsx`
- `src/components/properties/PropSceneMode.tsx`
- `src/components/properties/PropRow.tsx`
- `src/components/properties/PropSection.tsx`
- `src/components/properties/PropHeader.tsx`

---

## 3. Canvas chrome

### 3.1. ToolStrip (left)
Posição absoluta `left: 8, top: 12`, vertical, gap 2.
```
[V🖱 ] selecionar
[T 𝐀 ] texto
[H ✋ ] pan
```
Cada tool 26×26, ativo: bg `bg-elevated` + ícone+keylabel yellow. Keylabel mono 7px no canto inferior direito.

Bindings keyboard: `V/T/H` mudam tool ativa (state Zustand `editor.tool`).

### 3.2. StatusBar (top)
Linha 26px altura, padding `6px 14px 6px 50px` (50 reserva tool strip), border-bottom hairline.

Esquerda: `02 / 05 · Cena 02 · 1280 × 720 · 8s` (mono 10px secondary).
Direita: `X 320 · Y 180 · Z 78%` + chip "SNAP" yellow accent.

### 3.3. Ruler
Opcional, controlado por `tweaks.showRuler`. Top + left, 12px de espessura, marcações a cada 40px.

### 3.4. Paper texture
Overlay no fundo do artboard:
```css
background-image: radial-gradient(circle at 1px 1px, rgba(240,231,213,0.04) 1px, transparent 0);
background-size: 14px 14px;
```

### 3.5. Selection chrome (overlay sobre Fabric)
Quando objeto selecionado, renderizar overlay HTML por cima do canvas:
- Border `1px dashed var(--accent)`.
- 4 corner handles 6×6px sólido yellow.

> **Nota:** Fabric.js já tem selection nativa. **Substituir** estética padrão Fabric pelos tokens Glyph via `fabric.Object.prototype.set({ borderColor: '#E8B547', cornerColor: '#E8B547', ... })`.

### 3.6. EmptyCanvas
Quando cena não tem elementos: aspect-ratio 16/9, border tracejado, com:
- Headline Fraunces 800 italic 36px secondary 0.55 opacity: "Cena em branco."
- Subtítulo mono uppercase: "Arraste um asset · ou pressione T para escrever".

---

## 4. Properties Panel

Largura 280px, fundo `bg-deep`, border-left hairline, scroll vertical.

### 4.1. Header
`PropHeader`: título mono uppercase ("Texto" ou "Cena 02") + sub mono muted (`el-1` ou `sc-2`).

### 4.2. Modo Texto

Bloco Hero (quando há texto selecionado):
- Preview Fraunces 800 36px do conteúdo do texto.
- Linha mono muted: `Fraunces · 900 · 0–5.5s`.

Section "Transform":
- Row "X / Y": 2 NumFields lado a lado.
- Row "Tamanho": Slider + NumField px.
- Row "Rotação": Slider + NumField °.
- Row "Opacidade": Slider + NumField %.

Section "Tipo":
- Row "Fonte": label mono primary com nome ("Fraunces"). Click abre dropdown de fontes (futuro).
- Row "Peso": Slider 100–900 + NumField.
- Row "Tracking": Slider + NumField em em.
- Row "Leading": Slider + NumField.
- Row "Cor": `<Swatch />` + hex mono secondary.

Section "Efeitos":
- Grid 2×2 de botões mono 9.5 uppercase: Nenhum / Tremor / Neon / Letreiro. Ativo: bg accent + texto `#1A1F33`.
- Botão full-width "✦ Modo Split" (atalho ⏎): opens Lettering Studio (F6).

### 4.3. Modo Cena

Section "Cena":
- Row "Duração": Slider 0–30s + NumField.
- Row "Transição": SegBtn `Cut / Fade / Wipe`.
- Row "Fundo": Swatch + hex.

Section "Áudio da cena":
- Row "VO": filename mono secondary.
- Row "Volume": Slider + NumField %.
- Row "Noise": Toggle.

---

## 5. Store changes

```ts
type Editor = {
  tool: 'V' | 'T' | 'H';
  selectedElementId: string | null;
  showRuler: boolean;
};

selectElement(id: string | null): void;
updateElement(id: string, patch: Partial<Element>): void;
setTool(t: 'V'|'T'|'H'): void;
toggleRuler(): void;
```

`useFabricCanvas` emite:
```ts
canvas.on('selection:created', (e) => store.selectElement(e.target.id));
canvas.on('selection:updated', (e) => store.selectElement(e.target.id));
canvas.on('selection:cleared', () => store.selectElement(null));
canvas.on('object:modified', (e) => store.updateElement(e.target.id, { x, y, ... }));
```

Sliders/NumFields no Properties chamam `updateElement`, e um `useEffect` reaplica patches no objeto Fabric (`obj.set({ left, top, fontSize, ... })`; `canvas.requestRenderAll()`).

---

## 5b. Extras — ContextMenu + DragGhost (Extras.jsx · 2026-04-30)

### ContextMenu
220px min-width, `bg-elevated`, border hairline, border-radius 5, shadow `0 12px 32px -8px rgba(0,0,0,0.6)`. Padding `4px 0`.

- Header label: mono 9 muted uppercase + `border-bottom hairline`. 
- Separador: `height: 1px; background: border; margin: 4px 0`.
- Item: Geist 12, ícone 14px secondary à esquerda, shortcut mono 9.5 muted à direita.
- Item hover: `bg-surface`.
- Item danger: texto `--danger` + ícone danger.
- Item disabled: opacity 0.5, `cursor: default`.

Dois contextos de menu definidos no design:
1. **Scene Card** (botão direito no SceneList): Reproduzir · Duplicar · Renomear · Cortar-dividir · Inserir pausa antes · Exportar cena · [sep] · Remover (danger).
2. **Elemento no Canvas** (botão direito no canvas sobre elemento): Lettering Studio · Editar texto · [sep] · Duplicar · Trazer frente · Enviar trás · Bloquear · Ocultar · [sep] · Remover (danger).

Criar:
- `src/components/ui/ContextMenu.tsx`
- `src/hooks/useContextMenu.ts` — `{ open(e, items), close }`, posiciona no cursor, fecha com ESC/click fora.

### DragGhost + DropZone
Durante drag de asset do Sidebar ao canvas:
- **DropZone**: border `1.5px dashed accent` + `bg rgba(232,181,71,0.06)` cobrindo a área do canvas. Label mono accent "Soltar para adicionar à cena" + sub "Cena 02 · 0:00 → 0:08".
- **Drag ghost**: 150px card rotacionado −2deg com thumbnail frosted + borda accent + badge circular accent "1" no canto superior direito.
- **Modo timeline**: insertion line `2px accent` vertical + dot no topo.

Implementado com `onDragOver` no canvas + `setIsDragging(true)` + render condicional do overlay.

---

## 6. Critérios de aceite

- [ ] Tool strip aparece à esquerda do canvas; teclas V/T/H trocam ferramenta com feedback visual.
- [ ] Status bar superior mostra info da cena/elemento ao vivo.
- [ ] Ruler aparece quando ligado em settings (default on).
- [ ] Paper texture visível no artboard.
- [ ] Selecionar texto Fabric atualiza Properties para modo Texto.
- [ ] Mexer slider de fontSize muda texto no canvas em <16ms (60fps).
- [ ] Selection chrome do Fabric usa border yellow tracejado + handles sólidos.
- [ ] Empty state aparece quando cena sem elementos.
- [ ] Apenas **uma** cor accent ativa por tela (typically: tool ativa OU efeito ativo OU CTA — auditar).

---

## 7. TestSprite — TCs

- `TC_CAN_001`: pressionar T muda tool para texto.
- `TC_CAN_002`: criar texto Fabric e selecionar abre Properties modo Texto.
- `TC_CAN_003`: arrastar slider de tamanho atualiza fontSize no Fabric.
- `TC_CAN_004`: ruler liga/desliga via setting.
- `TC_CAN_005`: cena sem elementos mostra EmptyCanvas.
- `TC_CAN_006`: efeito "Neon" no Properties marca botão accent.
- `TC_CAN_007`: clique fora desseleciona e Properties volta a modo Cena.

---

## 8. Riscos

- **Sincronização Fabric ↔ Store** é o ponto crítico. Sem debounce, sliders podem disparar 60 updates/s. Mitigação: debounce de 16ms no `updateElement` quando vier do Properties; render-throttling no Fabric via `requestAnimationFrame`.
- **Z-index** do tool strip e status bar não devem cobrir interações Fabric. Manter pointer-events neutralizado em áreas decorativas.
- **Selection chrome HTML overlay**: posicionar com base em `obj.getBoundingRect()`; recalcular em `object:moving/scaling/rotating`.

---

## 9. Saída

- Editor com identidade visual editorial completa no canvas.
- Properties contextual funcional para texto e cena.
- Base pronta para F6 acoplar Lettering Studio sobre o canvas.
