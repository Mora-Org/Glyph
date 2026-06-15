# Plano de Implementação: Glyph Redesign — Master
Data: 2026-04-30
Versão: 1.0 (Elaborado por Antigravity, com handoff do Claude Design)

Este é o plano-mestre do **redesign visual completo do Glyph**, com base no bundle entregue pelo Claude Design (`.design-bundle/`). Cobre tokens, tipografia, e todas as telas do app: Dashboard, Editor, Lettering Studio, Export, Settings, e estados de erro/vazio.

> O bundle vivo está em `.design-bundle/glyph/project/` — protótipos HTML/CSS/JS. **O alvo é recriar pixel-perfect em React/Next.js+Tailwind**, não copiar a estrutura interna do protótipo.

---

## 1. Filosofia do redesign

Alinhado ao manifesto Mora: "estética da profundidade", "tecnologia com alma", "pausa necessária para a profundidade".

- **Editorial dark-first.** Midnight Indigo de fundo, Vanilla Cream para texto, amarelo editorial **uma vez por tela** (acento, não decoração).
- **Tipografia é protagonista.** Fraunces serif (display, variável com SOFT/WONK) compõe presença; Geist Sans cuida de UI; Geist Mono carrega dados/labels (mono uppercase com tracking).
- **Densidade controlada.** Editor é denso (timeline, props, sidebar, canvas), mas com hierarquia clara via tipografia + 4px grid.
- **Movimento contido.** Transições 120–300ms com `cubic-bezier(0.2, 0, 0, 1)`. Nada de bounce.
- **Sem ornamentos.** Bordas hairline (`#3A4160`), shadows só em modais.

---

## 2. Tokens canônicos (referência rápida)

```
--bg-deep        #1A1F33    Midnight Indigo (app bg)
--bg-surface     #232940    panels / cards / sidebars
--bg-elevated    #2D344D    modais, popovers, dropdowns
--border         #3A4160    1px hairline
--border-strong  #4A526F    hover/focus dividers

--text-primary   #F0E7D5    Vanilla Cream
--text-secondary #A8A294    desaturated cream
--text-muted     #6B6859    placeholders/disabled

--accent         #E8B547    yellow editorial
--accent-hover   #F0C25A
--accent-press   #D9A33A
--accent-soft    rgba(232,181,71,0.12)
--accent-ring    rgba(232,181,71,0.5)

--danger         #8B2838    Bordeaux (errors only)
--success        #6B8A5A    sage (success only)

--font-display   Fraunces (variable: opsz, SOFT, WONK, wght)
--font-sans      Geist (variable wght)
--font-mono      Geist Mono (variable wght)
```

**Espaçamento:** grid 4px (`--space-1..11` = 2,4,6,8,12,16,20,24,32,48,64).
**Raios:** `--r-sm 4`, `--r-md 6`, `--r-lg 10`, `--r-pill 999`.
**Layout:** topbar 40, sidebar-left 224, sidebar-right 280, lettering 208, timeline 180.

> Tokens completos em `.design-bundle/glyph/project/ds/colors_and_type.css`.

---

## 3. Princípios visuais

- **Acento amarelo** marca **uma** ação/estado por tela (CTA primário, item ativo, playhead). Nunca dois.
- **Mono uppercase** com `letter-spacing 0.10em` para todos os labels (`Projetos`, `Frame Rate`, `Cena 02`, etc.).
- **Numerais tabulares** (`font-variant-numeric: tabular-nums`) em qualquer dado: tempo, fps, duração, %.
- **Display Fraunces 900** para headlines; itálico Fraunces ativa `WONK 1, SOFT 80` para a palavra-acento da frase.
- **Hairline `#3A4160`** divide painéis. Nada de sombras entre painéis internos.
- **Foco** sempre `outline: 2px solid var(--accent-ring); outline-offset: 1px`.

---

## 4. Quebra em fases

| Fase | Plano | Escopo | Tamanho |
|---|---|---|---|
| **F1** | [F1 — Fundação DS](plano_implementacao_2026-04-30_v1_redesign_F1_fundacao.md) | Tokens em `globals.css`, fontes Fraunces/Geist/Geist Mono, primitivas `GlyphButton` + `GlyphInput` + `Toggle` + `Slider` + `Swatch` + ícones Lucide-style | S |
| **F2** | [F2 — Dashboard + Novo Projeto](plano_implementacao_2026-04-30_v1_redesign_F2_dashboard.md) | Reescrita do Dashboard: rail nav, headline editorial, grid de cards de projeto, empty state, modal Novo Projeto com presets de resolução/fps + validação | M |
| **F3** | [F3 — Editor Shell](plano_implementacao_2026-04-30_v1_redesign_F3_editor_shell.md) | Topbar (wordmark + projeto + autosave + Lettering + Exportar) e Sidebar com tabs (Mídia · Tipos · Efeitos · Pausas) com mocks de listas | M |
| **F4** | [F4 — Canvas + Properties](plano_implementacao_2026-04-30_v1_redesign_F4_canvas_props.md) | Canvas chrome (tool strip V/T/H, status bar, ruler, paper texture, selection chrome) + painel Properties contextual (Texto/Cena) com sliders, NumFields, Sections | M |
| **F5** | [F5 — Timeline + SceneList](plano_implementacao_2026-04-30_v1_redesign_F5_timeline_scenelist.md) | ElementTimeline (ruler, tracks por tipo, audio waveforms, transport, playhead) e SceneList (cards de cena com hero typography, pause cards, transition badges, ações rail) | M |
| **F6** | [F6 — Lettering Studio](plano_implementacao_2026-04-30_v1_redesign_F6_lettering_studio.md) | Modal grande: preview com per-glyph split + selection chrome, controles de string + modo split + grid de efeitos + sliders intensidade/velocidade | M |
| **F7** | [F7 — Export Modal](plano_implementacao_2026-04-30_v1_redesign_F7_export_modal.md) | Reescrita do ExportModal: estado idle (preview + tabela mono + estimativa) e estado rendering (progresso + frame counter + msg "não feche o app"). Bloqueia dismiss durante render | S |
| **F8** | [F8 — Settings + Erros](plano_implementacao_2026-04-30_v1_redesign_F8_settings_erros.md) | Tela de Settings (Aparência · FFmpeg · Pastas · Atalhos · Sobre) com cards agrupados, ErrorModal "FFmpeg ausente" com bloco de comando | M |

**Tamanhos:** S = ~meio dia, M = ~1 dia. Total estimado: ~7 dias úteis de implementação efetiva.

---

## 5. Ordem e dependências

```
F1 (Fundação DS)  ←—— BLOQUEIA TUDO
   │
   ├─→ F2 (Dashboard)         independente
   ├─→ F3 (Editor Shell)      ←─ habilita F4, F5, F6, F7
   │      │
   │      ├─→ F4 (Canvas+Props)
   │      ├─→ F5 (Timeline+SceneList)
   │      ├─→ F6 (Lettering)        depende de F4 (canvas chrome)
   │      └─→ F7 (Export Modal)     depende de F3 (overlay sobre Editor)
   │
   └─→ F8 (Settings+Erros)    independente
```

F1 é gargalo absoluto. Após F1, F2/F3/F8 podem rodar em paralelo. F4–F7 dependem de F3.

---

## 6. Workflow por fase

Cada fase segue o ciclo Mora:

1. **Antigravity** mantém o plano detalhado (já entregue nos arquivos por fase).
2. **Claude Design** (claude.ai/design) refina protótipos quando precisarmos iterar visualmente — referência viva em `.design-bundle/`.
3. **Claude Code** implementa a fase seguindo o plano; nunca avança sem TestSprite verde.
4. **TestSprite** valida com o test plan da fase (cada fase lista TCs específicos).
5. **César (Boss)** aprova o resultado visual antes do merge.

Documentos de saída por fase:
- `fixes/patch_notes.md` atualizado.
- Bug fixes detalhados em `fixes/bug_fix.md` se algo quebrar.

---

## 7. Princípios de implementação (todas as fases)

**Stack:**
- Tailwind v4 com tokens Glyph injetados em `globals.css` via `@theme inline` ou CSS custom properties no `:root`.
- Fontes: **self-hosted** (woff2/ttf variáveis) em `public/fonts/`, **não** Google Fonts em produção (offline-first, Tauri).
- Componentes em `src/components/glyph/` (novo namespace) para primitivas; telas continuam em `src/components/ui/`, `src/components/timeline/`, etc.

**Regras visuais:**
- Nada de Tailwind arbitrário cor: sempre via var CSS (ex. `style={{ color: 'var(--text-primary)' }}` ou utilities `bg-bg-deep` mapeadas no `@theme`).
- Acento yellow só **uma vez por tela** — auditar antes do commit.
- Toda tipografia usa as classes `glyph-display-*`, `glyph-h*`, `glyph-body`, `glyph-label`, `glyph-mono` definidas em F1.

**Regras de código:**
- Nunca quebrar a store Zustand existente sem migração explícita.
- Preview CSS deve seguir mantendo equivalência com pipeline FFmpeg (princípio CLAUDE.md).
- Sem comentários em código que descrevam **o que** o componente faz — apenas o **porquê** quando não-óbvio.

---

## 8. Critérios de aceite globais

- [ ] Todas as cores usam variáveis Glyph DS (sem hex literal hardcoded fora dos tokens).
- [ ] Todas as fontes carregam offline (sem Google Fonts em runtime).
- [ ] Auditoria de acento: nenhuma tela tem mais de **uma** ocorrência do amarelo `--accent` em CTA/estado simultâneo.
- [ ] Foco visível em todos os controles interativos (`--accent-ring`).
- [ ] TestSprite passa nos TCs específicos de cada fase + suite legada não regride.
- [ ] Build Tauri produção (`npm run tauri build`) gera bundle sem warnings de tema.

---

## 9. Riscos & mitigações

| Risco | Mitigação |
|---|---|
| Carregamento de fontes variáveis pesadas (Fraunces ~600KB) atrasa first paint | `font-display: swap` + preload do .woff2 mais usado (Geist regular) no `<head>` |
| Densidade do Editor não escala em telas <1280 | F3 define breakpoints mínimos; abaixo disso, mostra fallback "Janela muito pequena" |
| Mudança de tipografia quebra Fabric.js text rendering | F1 inclui smoke test em canvas Fabric com Fraunces antes de fechar |
| Tokens conflitam com Tailwind v4 default theme | F1 documenta a estratégia de override `@theme inline` |

---

## 10. Próximos passos imediatos

1. **Boss aprova** o master + a quebra em fases.
2. **TestSprite** prepara test plan macro (suite por fase).
3. **Claude Code** começa **F1 — Fundação DS** assim que aprovado.
4. Após cada fase, **Claude Design** é consultado para iterações visuais finas se necessário.

---

> Referência viva: `.design-bundle/glyph/project/`
> Chat de design: `.design-bundle/glyph/chats/chat1.md`
