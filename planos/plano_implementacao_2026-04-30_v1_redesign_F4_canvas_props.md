# F4 — Canvas + Properties · Plano Executável (split F4a/F4b)
Data: 2026-04-30 · Versão executável: 2026-06-15
Parte do [Glyph Redesign Master](plano_implementacao_2026-04-30_v1_glyph_redesign_master.md)

**Depende de:** F1, F3. **Habilita:** F6. **Tamanho:** M (dividido em 2 entregas).

> Plano aterrado no código real + revisão adversarial. **Premissa-mãe:** não tocar no motor Fabric
> (`addImage/addVideo/addGif/addText/setElementEffect/applyEffect/dispose/setDimensions 1280×720`).
> A revisão recomendou **separar o chrome inofensivo (F4a) da edição ao vivo arriscada (F4b)** — adotado.

---

## F4a — Canvas Chrome + fundação (ZERO risco no motor) ✅ esta entrega

| # | Item | Arquivo |
|---|---|---|
| A1 | Slice `editor` no store (`tool`, `selectedElementId`, `showRuler` + `selectElement/setTool/toggleRuler`) + `partialize` (só `project` persiste) | `src/store/projectStore.ts` |
| A2 | Eventos `selection:created/updated/cleared` → `selectElement(pegId)` (aditivo, one-way, sem loop) | `src/hooks/useFabricCanvas.ts` |
| A3 | `ToolStrip` (V/T/H: estado + visual + keybind com guard de INPUT/TEXTAREA/IText) | `src/components/canvas/ToolStrip.tsx` |
| A4 | `CanvasStatusBar` (idx/total · nome · 1280×720 · duração · X·Y do selecionado · Snap) | `src/components/canvas/CanvasStatusBar.tsx` |
| A5 | `CanvasRuler` (overlay básico gated por `showRuler`) | `src/components/canvas/CanvasRuler.tsx` |
| A6 | Paper texture (`.glyph-paper`) na artboard + EmptyCanvas "Cena em branco." (Fraunces italic) | `src/components/canvas/MainCanvas.tsx` |
| A7 | Token `--bg-void: #15192A` + bridge | `src/app/globals.css` |
| A8 | Wiring: void bg + chrome ao redor do canvas (slot `properties` segue `null` até F4b) | `src/components/ui/Editor.tsx` |

> **Tool em F4a = estado + visual + keybind** (satisfaz TC_CAN_001). Comportamento T=cria-texto / H=pan é F4b.
> **Handles de seleção:** mantidos em tom frio/neutro (NÃO accent) — ver orçamento de acento abaixo.

---

## F4b — Properties contextual com binding ao vivo (a parte perigosa) ⏳ próxima

Só entra depois de resolver os pré-requisitos abaixo (achados da revisão adversarial):

1. **Fronteira de commit nas primitivas** — adicionar `onCommit`/`onChangeEnd` (no pointerup) a
   `Slider` e `NumField`. Padrão F4b: `applyPatch` a cada `onChange` (preview ao vivo, coalescido por
   `requestRenderAll`); `updateElement` (persist) só no **commit** + debounce trailing ~150ms.
   *Resolve o thrash de localStorage síncrono (~120 writes/2s) e o re-render do Editor inteiro por tick.*
2. **`applyPatch` precisa de cast** — `obj.set({fontSize/text})` não existe em `FabricObject` base
   (só IText). Castar (`obj as unknown as {...}` ou `instanceof IText`). Validar com `npm run build`.
3. **Cor = `<input type="color">` nativo** (como `LetteringPanel.tsx:129`), não `Swatch` (que só exibe).
4. **Fonte única de verdade vs. LetteringPanel** — o LetteringPanel JÁ edita fontSize/fill/font/efeito
   dos mesmos textos (e seu preview ao vivo está quebrado: só chama `updateElement`). Decisão: rotear os
   handlers do LetteringPanel **também por `applyPatch`** e tratar o Properties como canônico (corrige os
   dois de uma vez). **Decisão visual/arquitetural pendente do Boss.**
5. **Efeito ativo × transform** — re-`setEffect` por frame causa stutter no ticker. Fazer re-aplicação
   **uma vez no commit** (graças à fronteira de commit do item 1), não por `onChange`.
6. **Campos sem schema ficam fora** — Opacidade/Peso/Tracking/Leading (→ F6); Fundo/Áudio/Noise/Wipe
   (precisam expandir `Scene`; hoje fundo é `#000000` hardcoded, áudio é por projeto, transição só `cut|fade`).

**Sync Fabric↔store (F4b):** `applyPatch(elementId, patch)` no hook — lookup por `pegId`, `obj.set` (com
cast), `setCoords` + `requestRenderAll`; exposto no `MainCanvasHandle`. `object:modified` (persistência de
drag) permanece intacto. `obj.set` programático NÃO dispara `object:modified` nem `selection:*` → one-way.

---

## Orçamento de acento (decisão a validar com o Boss)
Com texto animado selecionado, competem por `#E8B547`: tool ativo · badge Snap · trilha de cada Slider ·
botão de efeito ativo · handles de seleção. Para respeitar "1 acento de ação por região":
- **Handles de seleção:** tom frio/claro (NÃO accent) — reserva o amarelo para *estado de ação*.
- **Trilha do Slider:** neutra (`--border-strong`); accent só no thumb em foco/scrub (ajuste em F4b/polish).
- **Badge Snap:** subdued por padrão.
- Centralizar `ACCENT_HEX = '#E8B547'` (contexto 2D do Fabric não resolve CSS var).

---

## Contrato de não-regressão (F4a e F4b)
Canvas 1280×720; `object:modified` única via de persistência de drag; `addText`/`editing:exited`;
efeitos/`setElementEffect`/`animationLoops`; `LetteringPanel` (`addText`/`setEffect`); timeline + fade;
Strict Mode guard + `dispose`; chave `peg-project` (partialize só restringe serialização).

## Verificação
**F4a (Playwright):** statusbar com idx/dims/duração; ToolStrip V ativo; V/T/H trocam tool (keybind com
guard); paper texture; EmptyCanvas "Cena em branco."; ruler on/off; **sem erros de console; tsc sem erros novos.**
**F4b:** criar→selecionar texto abre Properties modo Texto; slider Tamanho muda fontSize ao vivo; clicar
fora → modo Cena; efeito Neon marca accent. TestSprite TC_CAN_001..007 antes de fechar a fase.
