# F6 — Lettering Studio
Data: 2026-04-30 · Versão: 1.0
Parte do [Glyph Redesign Master](plano_implementacao_2026-04-30_v1_glyph_redesign_master.md)

**Depende de:** F1, F3, F4.
**Tamanho:** M (~1 dia).

Modal grande dedicado à edição **per-glyph** de um texto: cada caractere é um objeto independente com baseline offset, rotação, e efeito próprio. Acessado pelo botão "Lettering" do Topbar ou pelo "Modo Split" no Properties.

---

## 1. Objetivos

- Criar `LetteringStudio` como modal full-feature (920px largura, 4 zonas: header, preview, controles, footer).
- Preview canvas que renderiza o texto **caractere a caractere** com offset/rotation por glyph.
- Controles para:
  - String editável (input grande Fraunces).
  - Toggle "Modo Split — cada caractere é um objeto".
  - Grid 2×2 de efeitos por glyph (Tremor / Neon / Vibration / Letreiro).
  - Sliders de Intensidade e Velocidade do efeito.
- Aplicar o resultado ao elemento texto Fabric quando "Aplicar à Cena" é clicado.

---

## 2. Arquivos-alvo

### Criar
- `src/components/lettering/LetteringStudio.tsx` (entry).
- `src/components/lettering/LetteringPreview.tsx` — preview canvas com per-glyph layout.
- `src/components/lettering/LetteringControls.tsx` — controles split (esq) + efeitos (dir).
- `src/components/lettering/EffectGrid.tsx` — grid 2×2 de presets.
- `src/utils/lettering/effectRunner.ts` — engine CSS (preview) + builder FFmpeg (futuro export).

### Modificar
- `src/components/properties/PropTextMode.tsx` — botão "Modo Split" abre LetteringStudio.
- `src/store/projectStore.ts` — campo `glyphs` opcional em elemento texto: `Array<{ char, dx, dy, dr, effect, intensity, speed }>`.

---

## 3. Layout do modal

```
┌─ ✦ Lettering Studio ─────────────────────  ✕
│   CENA 02 · TEXTO · 7 CARACTERES
├──────────────────────────────────────────────
│                                              │
│    R  e  s  p  i  r  o    ← per-glyph        │
│   [g01][g02][g03][g04*]...                   │
│                                              │
├─────────────────────┬────────────────────────┤
│ STRING              │ EFEITO POR GLYPH       │
│ [Respiro________]   │ [Tremor*][Neon]        │
│ ⚪ Modo Split — ...  │ [Vibrat.][Letreiro]    │
│                     │                        │
│                     │ INTENSIDADE  ━●━━━ 62% │
│                     │ VELOCIDADE   ━━●━━ 0.8s│
├─────────────────────┴────────────────────────┤
│ Preview animado · loop a cada 0.8s           │
│                          Cancelar  Aplicar  │
```

---

## 4. LetteringPreview

Área 280px altura, fundo `#15192A`, paper texture overlay.

### 4.1. Layout per-glyph
```tsx
word.split('').map((ch, i) => (
  <div style={{
    position: 'relative',
    transform: `translateY(${dy[i]}px) rotate(${dr[i]}deg)`,
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: 124,
    color: i === accentIdx ? 'var(--accent)' : 'var(--text-primary)',
    letterSpacing: '-0.03em',
  }}>
    {ch}
    {/* selection box */}
    <div style={{
      position: 'absolute', inset: -6,
      border: i === selectedIdx ? '1px solid var(--accent)' : '1px dashed rgba(232,181,71,0.35)',
    }} />
    {/* glyph index label */}
    <div style={{ position: 'absolute', left: 0, top: -18 }}>g{String(i+1).padStart(2,'0')}</div>
  </div>
))
```

### 4.2. Animação do efeito (preview CSS)
Cada efeito tem keyframes CSS pre-definidos:

```css
@keyframes glyph-tremor {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  25%      { transform: translate(-1px, 1px) rotate(-0.5deg); }
  50%      { transform: translate(1px, -1px) rotate(0.5deg); }
  75%      { transform: translate(-1px, -1px) rotate(0); }
}
/* neon-flicker, vibration, letreiro também */
```

Aplicar `animation: glyph-{effect} {speed}s ease-in-out infinite alternate;` no glyph com `animation-delay` decorrente do índice (`i * 0.05s`).

`intensity` afeta a amplitude via CSS variable injetada.

---

## 5. LetteringControls

### 5.1. Coluna esquerda
- Label mono "STRING".
- Input grande Fraunces 28 800: `<input value={word} onChange>`.
- Toggle "Modo Split — cada caractere é um objeto" (ligado por padrão neste modal; desligar desfaz a separação per-glyph).

### 5.2. Coluna direita
- Label mono "EFEITO POR GLYPH".
- Grid 2×2 de botões. Ativo: bg accent + texto `#1A1F33`. Inativos: bg-surface + texto secondary.
- 2 sliders com label esquerda mono + Slider + valor mono direita:
  - Intensidade 0–100%
  - Velocidade 0.2–3.0s (label mostra `0.8s`).

---

## 6. Footer

- Esquerda: mono muted "Preview animado · loop a cada 0.8s".
- Direita: `<GlyphButton ghost>Cancelar</GlyphButton>` + `<GlyphButton primary>Aplicar à Cena</GlyphButton>`.

---

## 7. Apply

Quando "Aplicar à Cena":
1. Para cada glyph com offset/rotation/effect, criar um objeto texto Fabric independente posicionado no offset atual.
2. Salvar na store como elemento composto: `{ type: 'lettering', glyphs: [...] }`.
3. Fechar modal e voltar para Editor com a cena atualizada.

> **Atenção:** A renderização Fabric per-glyph já existe no projeto (Fase 4 do PSD original) — reutilizar `src/components/typography/` se já houver implementação.

---

## 8. Critérios de aceite

- [ ] Modal abre via Topbar.Lettering ou via Properties → Modo Split.
- [ ] Preview mostra cada caractere com offset/rotação/cor própria.
- [ ] Selection box destaca glyph ativo com border yellow sólido; outros tracejado yellow soft.
- [ ] Trocar string atualiza preview em tempo real.
- [ ] Trocar efeito muda animação CSS.
- [ ] Sliders ajustam intensidade/velocidade visíveis.
- [ ] Aplicar à Cena salva no store + reflete no canvas Fabric.
- [ ] ESC e clique fora fecham modal sem aplicar.

---

## 9. TestSprite — TCs

- `TC_LET_001`: abrir Lettering Studio do Topbar.
- `TC_LET_002`: trocar string atualiza preview.
- `TC_LET_003`: ativar efeito Tremor anima glyphs.
- `TC_LET_004`: aplicar fecha modal e adiciona elemento composto na cena.
- `TC_LET_005`: cancelar não modifica cena.
- `TC_LET_006`: glyph selecionado tem border yellow sólido.

---

## 10. Riscos

- **Animação CSS** suave em 7+ glyphs simultâneos: validar 60fps. Mitigação: `will-change: transform`.
- **Equivalência FFmpeg** para export: glyph effects em CSS preview ≠ FFmpeg. Esta fase entrega só preview; **export real é fase futura**, não bloqueia merge desta.
- **Selection per-glyph**: clicar num glyph deve atualizar `selectedIdx`. Hit-test nas selection boxes overlay.

---

## 11. Saída

- Lettering Studio funcional para preview + aplicação.
- Glyphs salvos no store como elemento composto.
- Note explícito em patch_notes: "Export FFmpeg dos efeitos lettering pendente".
