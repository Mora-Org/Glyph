# F7 — Export Modal
Data: 2026-04-30 · Versão: 1.0
Parte do [Glyph Redesign Master](plano_implementacao_2026-04-30_v1_glyph_redesign_master.md)

**Depende de:** F1, F3.
**Tamanho:** S (~meio dia).

Reescreve o `ExportModal` existente para a estética editorial. Dois estados visuais distintos: `idle` (configuração) e `rendering` (progresso bloqueante).

---

## 1. Objetivos

- Substituir `src/components/ui/ExportModal.tsx` por versão Glyph DS.
- Estado **idle**: preview do projeto + tabela mono de configurações + estimativa de tamanho/tempo + ações Cancelar/Iniciar.
- Estado **rendering**: barra de progresso accent + frame counter + msg "não feche o app" + dismiss desabilitado.
- Manter toda a integração existente com `ffmpegBuilder`/`frameExporter` e comandos Tauri.

---

## 2. Arquivos-alvo

### Modificar
- `src/components/ui/ExportModal.tsx` — reescrita visual completa, mantendo lógica de export.
- `src/store/projectStore.ts` — campo `exportProgress: { state, percent, frame, totalFrames, etaSeconds }` se ainda não existir.

### Criar
- `src/components/ui/ExportPreview.tsx` — preview thumbnail com hero typography da primeira cena.

### Reusar
- `ModalShell` criado na F2.

---

## 3. Layout — estado idle

```
┌─ Exportar Projeto ───────────────  ✕
│   ENSAIO VERÃO 2026
├──────────────────────────────────
│ ┌──────────────────────────────┐ │
│ │  Respiro                     │ │  preview 16:9
│ │     do ensaio               │ │  bg #15192A
│ │              cena 01·preview │ │
│ └──────────────────────────────┘ │
│                                  │
│ ─ FORMATO            MP4 (H.264)│
│ ─ RESOLUÇÃO          1280 × 720 │
│ ─ FRAME RATE         30 fps     │
│ ─ BITRATE            8 Mbps · CRF 22│
│ ─ ACELERAÇÃO         NVENC (Auto)│
│ ─ RANGE              Projeto inteiro│
│   ESTIMATIVA         ~ 18 MB · 24s│
├──────────────────────────────────
│      Cancelar  Iniciar Exportação│
```

- Preview: aspect 16:9, hero text Fraunces (Respiro / do ensaio em accent itálico).
- Tabela: linhas com `padding: 9px 0; border-top: 1px solid border;` (última também border-bottom). Label esquerda mono uppercase muted; valor direita mono 11 primary tabular-nums.
- Linha "Estimativa" sem border-top, label mono muted.
- Footer: ghost "Cancelar" + primary "Iniciar Exportação".

---

## 4. Layout — estado rendering

```
┌─ Renderizando ───────────────────
│   ENSAIO VERÃO 2026
├──────────────────────────────────
│ ┌──────────────────────────────┐ │
│ │  preview                     │ │
│ └──────────────────────────────┘ │
│                                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │  barra accent 64%
│                                  │
│ Codificando vídeo...        64% │  mono 11
│ Frame 412 / 720    ~8s · NVENC  │  mono 9 muted
├──────────────────────────────────
│  ⓘ Renderizando — não feche o app│
```

- Barra: 2px altura, fundo `border`, fill `accent`.
- Sem ✕ no header; ESC desabilitado; clique fora não fecha.
- Footer: msg mono muted + sem botões.

---

## 5. State machine

```ts
type ExportState =
  | { state: 'idle' }
  | { state: 'rendering'; percent: number; frame: number; total: number; eta: number; encoder: string }
  | { state: 'done' }
  | { state: 'error'; message: string };
```

Transições:
- `idle` → click "Iniciar Exportação" → `rendering`.
- `rendering` → conclusão Tauri → `done` (mostrar success + botão "Abrir pasta" + "Fechar").
- `rendering` → erro → `error` (cf. F8 ErrorModal — pode reusar ErrorModal acima do Export).
- `done` / `error` → click → `idle` (reset).

---

## 5b. Toast System (Extras.jsx · 2026-04-30)

O sistema de notificações é entregue junto com F7 (contexto natural: "exportação concluída", "falha ao exportar").

### Componente Toast
360px largura, `bg-elevated`, border hairline, border-radius 6, shadow `0 12px 32px -8px rgba(0,0,0,0.55)`. Barra lateral 3px colorida (cor por variante).

| Variante | Cor | Ícone |
|---|---|---|
| success | `--success` (sage) | IconCheck |
| error | `--danger` (bordeaux) | IconAlert |
| info | `--accent` (yellow) | IconInfo |
| progress | `--accent` | IconFilm + barra de progresso 64% |

Estrutura interna:
- Header: ícone + label mono uppercase + botão X (dismissable).
- Título: Geist 13 600 primary.
- Body: Geist 12 secondary.
- Actions: links mono 10 uppercase (primary: accent, secondary: text-secondary).
- Progress bar (variante progress): 2px altura accent.

### ToastStack
Posição `fixed bottom-right` (16px cada), z-index 60, `flex-direction: column-reverse` para empilhar de baixo para cima.

### Criar
- `src/components/ui/Toast.tsx`
- `src/components/ui/ToastStack.tsx`
- `src/store/toastStore.ts` — `{ toasts, addToast(opts), dismissToast(id) }`
- `useToast()` hook para chamar de qualquer componente.

---

## 6. Critérios de aceite

- [ ] Modal abre com estado idle por default.
- [ ] Tabela de configurações mostra valores reais do projeto + presets.
- [ ] Preview reflete primeira cena (hero text Fraunces).
- [ ] Click "Iniciar Exportação" muda para state rendering, dispara comando Tauri.
- [ ] Barra de progresso anima de 0% para 100% conforme eventos do backend.
- [ ] Frame counter atualiza ao vivo.
- [ ] Durante rendering, ✕ some, ESC ignorado, click fora ignorado.
- [ ] Fim com sucesso mostra estado done + opção "Abrir pasta".
- [ ] Erro durante render mostra ErrorModal sobreposto, mantendo estado rendering parado.

---

## 7. TestSprite — TCs

- `TC_EXP_001`: modal abre via Topbar.Exportar.
- `TC_EXP_002`: tabela mostra resolução do projeto.
- `TC_EXP_003`: click iniciar muda layout para rendering.
- `TC_EXP_004`: progresso simulado avança barra accent.
- `TC_EXP_005`: durante rendering, ESC não fecha.
- `TC_EXP_006`: erro de FFmpeg sobrepõe ErrorModal.
- `TC_EXP_007`: success mostra botão Abrir pasta.

---

## 8. Riscos

- **Eventos Tauri**: garantir que `progress` events vêm com `frame/total/eta`. Se backend só emite `percent`, ajustar payload no Rust antes do front (fora desta fase mas sinalizar para Boss).
- **Preview generation**: usar primeira cena via store; se cena vazia, mostrar empty state mini ("Sem cena para preview").

---

## 9. Saída

- ExportModal Glyph DS funcional.
- State machine clara para idle/rendering/done/error.
- ErrorModal (F8) integrado quando algo dá errado.
