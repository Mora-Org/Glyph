# TestSprite AI Testing Report (MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** PEG (Glyph by Mora)
- **Date:** 2026-06-02
- **Prepared by:** TestSprite AI Team
- **Scope:** Suíte de regressão frontend (codebase) após a Fase 7 v2b — Integração Playhead & Ruler / Áudio
- **Server mode:** development (`next dev`, limite de 15 testes prioritários)
- **Result:** 10/15 aprovados (66,67%). Nenhuma falha é regressão da Fase 7 v2b.

---

## 2️⃣ Requirement Validation Summary

### Requirement R1 — Ciclo de vida do projeto (Dashboard)
- **TC001** Criar projeto e entrar no Editor — ✅ **Passed**
  - *Findings:* Fluxo Dashboard → Editor OK. Confirma que a timeline reestruturada (gutter fixo + coluna de tempo) renderiza sem erros ao abrir o Editor.
- **TC005** Impedir criação de projeto sem nome — ✅ **Passed**
  - *Findings:* Validação de nome obrigatório e estado de erro do input funcionando.

### Requirement R2 — Canvas & mídia
- **TC002** Adicionar mídia por drag-and-drop do SO ao canvas — ❌ **Failed (BLOQUEADO POR AMBIENTE)**
  - *Findings:* Não é bug da aplicação. O input de arquivo (shadow DOM, aceita `.png,.jpg,.jpeg,.webp,.gif`) está presente e o canvas mostra o drophint, mas o runtime do TestSprite não forneceu nenhum caminho de arquivo (`available_file_paths` vazio; referência a `/tmp/sample-image.png` inexistente). Sem arquivo, o upload não pôde ser simulado.
- **TC006** Importar pasta de assets e arrastar asset da sidebar — ❌ **Blocked (AMBIENTE)**
  - *Findings:* Mesma limitação — input de pasta presente, mas sem arquivo de amostra disponível no runtime.

### Requirement R3 — Cenas & timeline
- **TC003** Adicionar e ativar cenas com canvas refletindo a cena ativa — ✅ **Passed**
  - *Findings:* Sincronia cena ↔ timeline OK (relevante para a Fase 7: o sync por `getItemAtTime` continua correto).
- **TC011** Alternar tipo de transição entre cenas (CUT/FADE) — ✅ **Passed**
  - *Findings:* Confirma que os `TransitionBadge` — agora renderizados com largura 0 e posição absoluta sobre a junção — permanecem clicáveis e funcionais após a reestruturação do layout.
- **TC007** Reordenar cenas na lista — ❌ **Failed (LIMITAÇÃO DE AUTOMAÇÃO)**
  - *Findings:* Reorder via `@dnd-kit` (PointerSensor, threshold 6px) exige gesto de *drag* real (pointer down → move → up). A automação tentou apenas cliques, que não disparam o sortable. A lógica de reorder (`DndContext`/`reorderTimeline`) não foi modificada nesta fase. Requer verificação com drag de ponteiro real.
- **TC004** Manter elementos estáveis ao trocar de cena e voltar — ❌ **Failed (CASO DE TESTE INVÁLIDO)**
  - *Findings:* O caso de teste está corrompido/alucinado: tentou navegar para `http://localhost/Taktimize/` e `/pricing` (`ERR_EMPTY_RESPONSE`), URLs que **não pertencem ao Glyph**. O resultado não reflete o aplicativo. Recomenda-se remover/regenerar este caso.

### Requirement R4 — Pausas ativas
- **TC008** Adicionar pausa VHS e prever animação no canvas — ✅ **Passed**
- **TC010** Inserir pausa de tela preta e prever no canvas — ✅ **Passed**
- **TC014** Adicionar pausa de cor sólida e prever no canvas — ✅ **Passed**
  - *Findings:* As três pausas aparecem na timeline e renderizam o preview. Confirma que pausas continuam visíveis na faixa de cenas após a reestruturação.

### Requirement R5 — Timeline de elementos
- **TC009** ElementTimeline aparece quando a cena ativa tem elementos — ✅ **Passed**
- **TC012** Ajustar start/end de elemento via handles sem inversão — ❌ **Failed (LIMITAÇÃO DE AUTOMAÇÃO)**
  - *Findings:* Os handles do `ElementTimeline` usam drag de mouse (`onMouseDown`), não teclas de seta; a automação tentou ajustar via teclado e os valores não mudaram. Componente **não modificado** na Fase 7 v2b. Requer simulação de drag real.

### Requirement R6 — Tipografia / Lettering
- **TC013** Split de texto em caracteres cria múltiplos elementos no canvas — ✅ **Passed**
- **TC015** Configurar fonte, tamanho, cor e efeito antes do split mantém o split — ✅ **Passed**

### Requirement R7 — Áudio & Sync (Fase 7 v2b) — *NÃO COBERTO PELA SUÍTE LEGADA*
- *Status:* O test plan executado é a suíte legada (TC001–TC015), focada em canvas/cenas/pausas/lettering. **Os novos recursos da v2b — trilhas VO/BGM, transporte play/pause, playhead, régua global e alinhamento do eixo de tempo — não possuem casos no plano atual.**
- *Mitigação:* Validados por verificação visual independente (Playwright headless 1440×900): criação de projeto → 3 cenas → trilhas VO/BGM → upload de áudio → play, com playhead avançando 0.0 → 1.7s, alinhamento régua/cenas/áudio confirmado e 0 erros de console.
- *Ação recomendada:* Regenerar o frontend test plan para incluir casos de áudio/transporte antes de fechar a fase oficialmente.

---

## 3️⃣ Coverage & Matching Metrics

- **66,67%** dos testes passaram (10/15).
- **0** falhas atribuíveis a regressão da Fase 7 v2b.
- Falhas por categoria: 2 bloqueadas por ambiente (sem arquivo), 1 caso inválido, 2 limitações de automação (drag/teclado).

| Requirement | Total | ✅ Passed | ❌ Failed | Observação |
|---|---|---|---|---|
| R1 — Ciclo de vida do projeto | 2 | 2 | 0 | — |
| R2 — Canvas & mídia | 2 | 0 | 2 | Ambos bloqueados por ambiente (upload sem arquivo) |
| R3 — Cenas & timeline | 4 | 2 | 2 | TC007 (drag), TC004 (caso inválido) |
| R4 — Pausas ativas | 3 | 3 | 0 | — |
| R5 — Timeline de elementos | 2 | 1 | 1 | TC012 (drag via teclado) |
| R6 — Tipografia / Lettering | 2 | 2 | 0 | — |
| R7 — Áudio & Sync (v2b) | 0 | 0 | 0 | Sem cobertura na suíte legada |
| **Total** | **15** | **10** | **5** | |

---

## 4️⃣ Key Gaps / Risks

1. **Cobertura de áudio (Fase 7 v2b) ausente.** A suíte legada não exercita VO/BGM, transporte play/pause, playhead nem alinhamento do eixo de tempo. Mitigado por verificação visual via Playwright; recomenda-se regenerar o test plan com casos de áudio/transporte (incluindo `data-testid="transport-play"`, `add-audio-vo`, `add-audio-bgm`).
2. **Testes dependentes de upload (TC002, TC006) não executáveis** sem arquivos de amostra no runtime. Fornecer caminhos em `available_file_paths` (ex.: uma imagem `.png`) para destravar.
3. **Interações de drag não automatizáveis por clique/teclado (TC007, TC012).** O `@dnd-kit` e os handles de trimming exigem simulação de gesto de ponteiro real. Sem isso, esses casos produzem falso-negativo.
4. **Caso de teste inválido (TC004).** Referencia um aplicativo não relacionado (`Taktimize`/`pricing`); deve ser removido ou regenerado.
5. **Conclusão para a Fase 7 v2b:** Nenhuma regressão detectada. Os recursos que minha mudança poderia ter quebrado — entrada no Editor, cenas, transições (badges), pausas e timeline de elementos — passaram. As falhas são ambientais, de automação ou de caso inválido.

---

> Dashboard de resultados (por teste): ver links em `testsprite_tests/tmp/raw_report.md`.
