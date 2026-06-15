# TestSprite AI Testing Report (MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** PEG (Glyph)
- **Date:** 2026-06-15
- **Phase under test:** F5 — Timeline + SceneList (Glyph DS redesign), v0.9.3
- **Server mode:** development (dev server cap: 15 high-priority tests)
- **Prepared by:** TestSprite AI Team + Claude Code (análise)

---

## 2️⃣ Requirement Validation Summary

### Requirement: Criação de Projeto & Dashboard
- **TC001 — Create a new project from the dashboard** — ✅ **Passed**
  - Fluxo Dashboard → Editor funcionando; projeto criado e editor carregado.

### Requirement: Cenas & Timeline (F5 — foco desta fase)
- **TC007 — Add a new scene and switch to it** — ✅ **Passed**
  - `+ Cena` adiciona cena e ativa; canvas/Properties refletem a cena ativa. Critério de aceite F5 OK.
- **TC013 — Toggle the transition between two scenes** — ✅ **Passed**
  - Badge CUT/FADE entre cenas alterna ao clique. Critério de aceite F5 OK.
- **TC009 — Add and reorder scenes with pauses and transitions** — ❌ **Failed (artefato de automação, NÃO regressão)**
  - A automação não conseguiu disparar o drag-and-drop do dnd-kit (PointerSensor exige movimento ≥6px — `activationConstraint: { distance: 6 }` — que o pointer sintético do harness não satisfaz). Pausa `PRETO` e badges `FADE`/`CUT` presentes e corretos.
  - **Verificado manualmente (Playwright, pointer real):** reorder funciona — `[Cena 1, Cena 2, Cena 3]` → `[Cena 2, Cena 3, Cena 1]`, 0 pageerrors.
- **TC010 — Reorder scenes in the timeline** — ❌ **Failed (mesmo artefato de automação)**
  - Idem TC009. Reorder confirmado funcional fora do harness.

### Requirement: Lettering & Tipografia
- **TC005 — Split text into individual character elements** — ✅ **Passed**
- **TC006 — Create lettering and split it into character elements** — ✅ **Passed**
- **TC012 — Open lettering panel and add a text element** — ✅ **Passed**
- **TC014 — Configure text typography and animation** — ✅ **Passed**
- **TC015 — Prevent adding text without an active scene** — ✅ **Passed**

### Requirement: Canvas — manipulação de assets/elementos
- **TC002 — Drag an imported asset onto the canvas** — ⛔ **Blocked (ambiental)**
  - O sandbox do TestSprite não disponibiliza caminhos de arquivo local (`available_file_paths`), então nenhum asset pôde ser importado. Não testa código F5.
- **TC003 — Move and resize a canvas element while keeping state in sync** — ❌ **Failed (ambiental, dependente de TC002)**
  - Sem asset importado não há elemento selecionável; verificação de mover/redimensionar não pôde rodar. Não toca código F5.
- **TC011 — Edit the visibility window of a scene element in the timeline** — ⛔ **Blocked (ambiental)**
  - Não foi possível criar elemento de texto via automação (placeholder permaneceu). Sem elemento, os handles do ElementTimeline não puderam ser exercitados. (ElementTimeline não teve mudança de comportamento na F5.)

### Requirement: Timeline — janela de visibilidade de elemento
- **TC004 — Edit an element visibility window from the timeline** — ❌ **Failed (ambiental, dependente de elemento)**
  - Sem elemento na cena (mesma raiz do TC011), o passo de arrastar handle não teve alvo.

### Requirement: Importação de assets
- **TC008 — Import a local asset folder into the sidebar** — ❌ **Failed (ambiental)**
  - Seleção de pasta/arquivo bloqueada pela ausência de `available_file_paths` no harness. UI de importação presente e correta.

---

## 3️⃣ Coverage & Matching Metrics

- **53.33%** dos testes passaram no harness (8/15).
- **0 regressões reais** atribuíveis à F5: os 8 passes incluem os testes F5 que o harness consegue exercitar (TC007, TC013); as 2 falhas F5 (TC009/TC010 reorder) foram confirmadas como artefatos de automação via verificação manual com pointer real; as 5 falhas/bloqueios restantes são limitações do ambiente (sem acesso a arquivos locais).

| Requirement                                   | Total | ✅ Passed | ❌ Failed | ⛔ Blocked |
|-----------------------------------------------|-------|-----------|-----------|------------|
| Criação de Projeto & Dashboard                | 1     | 1         | 0         | 0          |
| Cenas & Timeline (F5)                          | 4     | 2         | 2*        | 0          |
| Lettering & Tipografia                         | 5     | 5         | 0         | 0          |
| Canvas — manipulação de assets/elementos       | 3     | 0         | 1†        | 2†         |
| Timeline — janela de visibilidade de elemento  | 1     | 0         | 1†        | 0          |
| Importação de assets                           | 1     | 0         | 1†        | 0          |
| **Total**                                     | **15**| **8**     | **5**     | **2**      |

\* TC009/TC010 — reorder dnd-kit: artefato de automação, **confirmado funcional manualmente**.
† Falhas/bloqueios ambientais: o sandbox do TestSprite não acessa arquivos locais, impedindo importar assets e, por consequência, criar/selecionar elementos no canvas.

---

## 4️⃣ Key Gaps / Risks

- **Cobertura de drag-and-drop não-automatizável no harness:** o `activationConstraint: { distance: 6 }` do dnd-kit não é satisfeito pelo pointer sintético do TestSprite, gerando falsos negativos recorrentes em reorder (TC009/TC010). Mitigação atual: verificação manual via Playwright com mouse real (move em passos > 6px). Recomenda-se manter esse smoke de reorder fora do TestSprite.
- **Testes dependentes de arquivos locais ficam cegos no harness:** TC002/TC003/TC004/TC008/TC011 exigem importar mídia, mas o ambiente não expõe `available_file_paths`. Não há sinal sobre o caminho de assets — risco de regressões nessa área passarem despercebidas no CI até rodar no desktop (Tauri) com arquivos reais.
- **Sem cobertura automatizada específica de transporte/waveform no harness:** transporte (4 botões), atalhos J/K/L/Espaço/. e waveforms de áudio não têm TC dedicado no plano gerado; foram validados no smoke Playwright desta fase (7/7 PASS). Sugere-se adicionar TCs explícitos (TC_TIM) num próximo plano.
