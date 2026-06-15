# F5 — Timeline + SceneList
Data: 2026-04-30 · Versão: 1.0
Parte do [Glyph Redesign Master](plano_implementacao_2026-04-30_v1_glyph_redesign_master.md)

**Depende de:** F1, F3.
**Tamanho:** M (~1 dia).

Substitui a `ElementTimeline` e a `SceneList` atuais pelas versões editoriais. Inclui transport (J/K/L/.), waveforms procedurais para áudio, ruler com playhead chip yellow, e cards de cena com hero typography.

---

## 1. Objetivos

- Reescrever `ElementTimeline` (entre canvas e SceneList): header com label + tempo + transport + zoom; ruler com ticks por segundo + playhead chip; tracks por elemento (text/image/video) + 2 tracks de áudio com waveforms.
- Reescrever `SceneList` no rodapé: scene cards com hero Fraunces, pause cards, transition badges entre cenas, painel de ações lateral (+ Cena / + Pausa / + Áudio).
- Conectar ao playhead da store existente.

---

## 2. Arquivos-alvo

### Modificar
- `src/components/timeline/SceneList.tsx` — reescrita completa (manter API de reordenação/dnd-kit).
- `src/components/timeline/Playhead.tsx` — adaptar para chip yellow.
- `src/components/timeline/GlobalRuler.tsx` — alinhar visual com novos tokens.

### Criar
- `src/components/timeline/ElementTimeline.tsx` — substitui o atual ElementTimeline (se existir) ou cria novo.
- `src/components/timeline/Transport.tsx`
- `src/components/timeline/TimelineRuler.tsx` (interno à ElementTimeline)
- `src/components/timeline/TrackRow.tsx`
- `src/components/timeline/Waveform.tsx`
- `src/components/timeline/SceneCard.tsx`
- `src/components/timeline/PauseCard.tsx`
- `src/components/timeline/TransitionBadge.tsx`
- `src/components/timeline/SceneListActions.tsx`

### Constantes
- `src/components/timeline/TimelineConstants.ts` — já existe; estender com:
  - `TRACK_HEIGHT = 28`
  - `TRACK_LABEL_WIDTH = 110`
  - `RULER_HEIGHT = 16`
  - `SCENE_CARD_WIDTH = 156`
  - `PAUSE_CARD_WIDTH = 96`

---

## 3. ElementTimeline

Container `border-bottom: 1px solid border; bg: bg-deep`.

### 3.1. Header (30px)
- Esquerda: `Timeline — Cena 02 · 8s` mono uppercase secondary.
- Direita: timecode atual `{playhead.toFixed(2)}<span muted> / {duration}s</span>` + `<Transport />` + divisor + `Zoom 100%` mono muted.

### 3.2. TimelineRuler (16px)
- Coluna fixa 110px à esquerda (alinhada com track labels).
- Área principal: ticks por segundo, label mono 8px muted.
- **Playhead chip**: posição absoluta na área principal, fundo accent, texto Geist Mono 8px `#1A1F33`. `padding: 0 4px; border-radius: 1px; line-height: 14px;`.

### 3.3. Track rows (28px cada)
Por elemento da cena:
- Coluna 110px: tag tipo (3 letras uppercase fundo colorido + texto cena bg) + nome mono 9.5px.
- Área restante: bloco da duração com cor por tipo:
  - text: `rgba(240,231,213,0.55)`
  - image: `rgba(232,181,71,0.45)`
  - video: `rgba(200,72,92,0.45)`
  - audio: `rgba(107,138,90,0.5)`
- Selecionado: outline yellow + bg `rgba(232,181,71,0.7)` + texto cena bg `#1A1F33`.

### 3.4. Audio tracks
2 tracks fixas no rodapé com waveforms procedurais (renderizadas via `<Waveform />`):
- `vo-cena2` ícone IconMic.
- `bgm-warmer` ícone IconMusic.

`<Waveform color={...} dense?>` gera N barras com altura via `Math.sin` para preview. Em produção real, virá de análise de buffer (futuro).

### 3.5. Playhead vertical line
Position absolute, full height da área de tracks, `width: 1px; bg: var(--accent); pointer-events: none; z-index: 2`.

### 3.6. Transport
4 botões 22×22:
- Rewind (J)
- Play/Pause (K) ← ativo: bg `bg-elevated` + ícone yellow
- Forward (L)
- Stop (.)

Bindings: J/K/L/. globais quando Editor focado.

---

## 4. SceneList (rodapé do Editor)

Container 102px min, `bg: bg-deep`. Layout horizontal scroll + painel ações fixo à direita.

### 4.1. Cards (scroll horizontal)
Lista intercalando:
- `<SceneCard>` para `kind: 'scene'`.
- `<PauseCard>` para `kind: 'pause'`.
- `<TransitionBadge>` entre 2 SceneCards.

### 4.2. SceneCard (156×~96px)
```
┌────────────────────┐
│  Respiro           │  Fraunces 800 17 hero
│                 02 │  index mono 7
├────────────────────┤
│ Cena 02      8s    │  nome Geist + duration mono
└────────────────────┘
```
Ativo: `border-left: 2px solid accent`; bg `bg-elevated` + radius arredondado só nas direitas.

DnD via `@dnd-kit/core` (já no projeto) — preservar comportamento atual de reorder.

### 4.3. PauseCard (96×~96px)
Thumb 56px com textura por tipo (black sólido / vhs gradient / static dotted), label mono uppercase + duração.

### 4.4. TransitionBadge
Renderizado entre dois SceneCards quando `scenes[i].transition` existe.
Símbolo + label uppercase: `| cut`, `◐ fade`, `◧ wipe`.

### 4.5. Actions panel (lateral direito)
Largura ~134px, border-left hairline, padding `12px 14px`. 3 botões verticais full-width:
- `+ Cena` (Geist 11 600 + IconClapperboard)
- `+ Pausa` (secondary + IconPause)
- `+ Áudio` (secondary + IconMic)

---

## 5. Critérios de aceite

- [ ] ElementTimeline mostra ruler com ticks, playhead chip yellow, tracks coloridos por tipo.
- [ ] Tracks de áudio mostram waveforms procedurais.
- [ ] Transport com 4 botões; Play ativo destacado yellow.
- [ ] Atalhos J/K/L/Espaço/. funcionam e sincronizam playhead store.
- [ ] SceneList exibe SceneCards + PauseCards + TransitionBadges intercalados.
- [ ] Reordenação dnd-kit continua funcional.
- [ ] Cena ativa destacada border-left yellow.
- [ ] Botões `+ Cena / + Pausa / + Áudio` criam itens no store.
- [ ] Apenas uma ocorrência de yellow em estado ativo (playhead OU cena ativa, ambos OK porque são contextos diferentes — auditar com Boss caso visualmente competam).

---

## 6. TestSprite — TCs

- `TC_TIM_001`: timeline mostra ticks de segundo conforme duração da cena.
- `TC_TIM_002`: playhead chip mostra timecode formatado `0.00`.
- `TC_TIM_003`: track de elemento aparece com cor correta por tipo.
- `TC_TIM_004`: clicar em element track destaca o elemento na canvas (e vice-versa).
- `TC_TIM_005`: K alterna play/pause.
- `TC_SCN_001`: SceneList renderiza N scene cards.
- `TC_SCN_002`: TransitionBadge aparece entre 2 SceneCards consecutivos.
- `TC_SCN_003`: drag-and-drop reordena cenas.
- `TC_SCN_004`: + Cena adiciona cena ao final.
- `TC_SCN_005`: clique em SceneCard ativa cena e atualiza canvas.

---

## 7. Riscos

- **Performance** com muitos elementos × waveform: limitar n bars a 80; memoizar geração.
- **Sync playhead** entre ruler chip e linha vertical: usar a mesma fonte (`store.playhead`). Testar com timeline de 60s+.
- **dnd-kit** quebrar visualmente nos novos cards: garantir `forwardRef` e `style` mergeable nos componentes.

---

## 8. Saída

- Timeline + SceneList em identidade Glyph completa.
- Transport keyboard funcional.
- Pronto para conectar audio waveforms reais em fase futura (fora do redesign).
