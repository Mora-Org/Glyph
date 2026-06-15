# Controle de Fases — Glyph (by Mora)
Data: 2026-04-01

Este arquivo rastreia o progresso macro das fases do projeto **Glyph (v1.4)**.

- [x] **Fase 0: Setup & Ambiente** (Tauri Init, Rust Bridge)
- [x] **Fase 1: Fundação** (Design System, Store, Dashboard)
- [x] **Fase 2: Motor do Canvas** (Fabric.js, Imagens/Vídeos, Transformações)
- [x] **Fase 3: Cenas e Timeline** (Reordenação, Pausas Ativas, Transições)
- [x] **Fase 4: Tipografia & GIF** (Lettering Split, GIFs, Efeitos) — **CONCLUÍDA** *(TC011/TC021/TC022 corrigidos; TC021_manual: PASSOU)*
- [x] **Fase 5: Exportação** (FFmpeg Pipeline, GPU Detection) — **CONCLUÍDA** *(UI + mock: TC028 + TC100 PASSOU; integração real FFmpeg pendente até build Tauri)*
- [x] **Fase 6: Branding & Refactor** (Migração oficial para Glyph e Identidade Mora) — **CONCLUÍDA**
    - [x] Rebrand PEG → Glyph (commits + push para Mora-Org/Glyph)
    - [x] **v2a: Refinamento Visual Timeline** — contraste e badges aplicados (refinamento completo anotado pós-Fase 8)
- [/] **Fase 7: Áudio & Sync** (Avançado: Noise Removal, Multi-track) — **EM EXECUÇÃO**
    - [x] **v2b: Playhead & Ruler Integration** — *integrado, build verde, verificação visual OK e TestSprite sem regressões (v0.8.0). Eixo de tempo único (gutter + coluna scrollável), playhead com scrubbing + transporte play/pause, áudio alinhado às cenas. TestSprite: 10/15 (as 5 falhas são ambientais/automação/caso inválido, não regressões — ver `testsprite_tests/testsprite-mcp-test-report.md`). Pendente p/ fechar a fase: cobertura de teste específica de áudio + aprovação final do Boss.*
- [ ] **Fase 8: Ferramentas Artísticas** (Avançado: Eraser Tool, Clipping Masks, HSL)
- [ ] **Fase 8.5: Polimento Visual UI** (refinamento completo da Timeline e Editor) — ver `planos/ui_melhorias_timeline.md`
    - [ ] Altura da barra da timeline (~80px fixo)
    - [ ] Padding interno nos cartões de cena
    - [ ] Botões "Cena" e "Pausa" com mais respiro
    - [ ] Botões do topo (Lettering/Exportar) com padding
- [ ] **Track Redesign Editorial: Glyph DS** (overhaul visual completo, handoff Claude Design 2026-04-30) — ver [`plano_implementacao_2026-04-30_v1_glyph_redesign_master.md`](plano_implementacao_2026-04-30_v1_glyph_redesign_master.md)
    - [x] **F1 — Fundação DS** (tokens, Fraunces/Geist/Geist Mono, primitivas) — *bloqueia tudo* — [plano](plano_implementacao_2026-04-30_v1_redesign_F1_fundacao.md)
    - [ ] **F2 — Dashboard + Novo Projeto** (rail nav, headline editorial, grid de cards, modal com presets) — [plano](plano_implementacao_2026-04-30_v1_redesign_F2_dashboard.md)
    - [/] **F3 — Editor Shell** (Topbar + Sidebar 4 tabs) — *implementado + verificado via Playwright (v0.9.0): topbar editorial, sidebar 4 abas, palette Indigo, sem erros de console, tsc sem erros novos. **Habilita F4/F5/F6/F7.** Pendente p/ fechar: TestSprite regenerado (TC006/007/008/020/025 antigos dependiam de `Assets`/xpath do header/"+ Pasta") + aprovação visual do Boss (auditoria de acento).* — [plano](plano_implementacao_2026-04-30_v1_redesign_F3_editor_shell.md)
    - [x] **F4 — Canvas + Properties** (chrome, tool strip, ruler, Properties panel contextual) — **CONCLUÍDA** *(F4a v0.9.1 + F4b v0.9.2, verificadas via Playwright). Chrome do canvas (ToolStrip V/T/H, StatusBar, Ruler, "Cena em branco." Fraunces italic) + Properties contextual com binding ao vivo (Tamanho 72→273 ao vivo + persist no commit), modo Texto/Cena, LetteringPanel roteado pelo mesmo applyPatch. Handles neutros + onCommit nas primitivas (aprovação do Boss). **Habilita F6.** Polish pendente: trilha de slider accent→neutra; TestSprite TC_CAN_001..007. Campos sem schema (opacidade/peso/tracking → F6; fundo/áudio da cena → expandir Scene).* — [plano](plano_implementacao_2026-04-30_v1_redesign_F4_canvas_props.md)
    - [/] **F5 — Timeline + SceneList** (ruler, transport J/K/L, waveforms, scene cards, transition badges) — *implementado + verificado via Playwright (v0.9.3): cards de cena Fraunces + pausas + TransitionBadges intercalados, régua de eixo único, playhead chip yellow, transporte de 4 botões (Rewind/Play-Pause/Forward/Stop), atalhos J/K/L/Espaço/. sincronizados ao playhead da store, waveforms procedurais nas trilhas de áudio. Smoke 7/7 PASS, 0 erros de console; tsc/next build verdes. TestSprite 8/15 (0 regressões reais: TC007/TC013 F5 passaram; TC009/TC010 reorder = artefato de automação, reorder confirmado manual; resto ambiental). **Pendente p/ fechar:** aprovação visual do Boss (auditoria de acento playhead vs. cena ativa).* — [plano](plano_implementacao_2026-04-30_v1_redesign_F5_timeline_scenelist.md)
    - [ ] **F6 — Lettering Studio** (modal per-glyph com efeitos) — [plano](plano_implementacao_2026-04-30_v1_redesign_F6_lettering_studio.md)
    - [ ] **F7 — Export Modal** (idle/rendering states) — [plano](plano_implementacao_2026-04-30_v1_redesign_F7_export_modal.md)
    - [ ] **F8 — Settings + Erros** (tela de Configurações + ErrorModal reusável) — [plano](plano_implementacao_2026-04-30_v1_redesign_F8_settings_erros.md)
- [ ] **Fase 9: VOID Engine** (AI Video Deletion) — **[Glyph Obsidian]**
    - [ ] Pesquisa de portabilidade ONNX/Rust (Claude Code)
    - [ ] Implementação de quadmask conditioning no Canvas Fabric.js
    - [ ] Integração de inferência nativa no Rust Backend (via ONNX Runtime)

---
> [!IMPORTANT]
> **Prioridade Estratégica:** O desenvolvimento atual foca no **Glyph Core**, que servirá de alicerce tanto para a versão estável quanto para a **Obsidiana** (experimental/IA). A transição oficial para o nome **Glyph** está ocorrendo na Fase 6.

> [!TIP]
> Detalhes granulares no [Plano de Implementação v1.3.1](plano_implementacao_2026-03-31_v1.md) e no PSD.
