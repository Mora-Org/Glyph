# Controle de Fases — Glyph (by Mora)
Data: 2026-04-01

Este arquivo rastreia o progresso macro das fases do projeto **Glyph (v1.4)**.

- [x] **Fase 0: Setup & Ambiente** (Tauri Init, Rust Bridge)
- [x] **Fase 1: Fundação** (Design System, Store, Dashboard)
- [x] **Fase 2: Motor do Canvas** (Fabric.js, Imagens/Vídeos, Transformações)
- [x] **Fase 3: Cenas e Timeline** (Reordenação, Pausas Ativas, Transições)
- [x] **Fase 4: Tipografia & GIF** (Lettering Split, GIFs, Efeitos) — **CONCLUÍDA** *(TC011/TC021/TC022 corrigidos; TC021_manual: PASSOU)*
- [x] **Fase 5: Exportação** (FFmpeg Pipeline, GPU Detection) — **CONCLUÍDA** *(UI + mock: TC028 + TC100 PASSOU; integração real FFmpeg pendente até build Tauri)*
- [/] **Fase 6: Branding & Refactor** (Migração oficial para Glyph e Identidade Mora) — **EM EXECUÇÃO**
    - [x] **v2a: Refinamento Visual Timeline** — contraste e badges aplicados (refinamento completo anotado pós-Fase 8)
    - [ ] Repo GitHub pendente
- [ ] **Fase 7: Áudio & Sync** (Avançado: Noise Removal, Multi-track)
    - [ ] **v2b: Playhead & Ruler Integration**
- [ ] **Fase 8: Ferramentas Artísticas** (Avançado: Eraser Tool, Clipping Masks, HSL)
- [ ] **Fase 8.5: Polimento Visual UI** (refinamento completo da Timeline e Editor) — ver `planos/ui_melhorias_timeline.md`
    - [ ] Altura da barra da timeline (~80px fixo)
    - [ ] Padding interno nos cartões de cena
    - [ ] Botões "Cena" e "Pausa" com mais respiro
    - [ ] Botões do topo (Lettering/Exportar) com padding
- [ ] **Fase 9: VOID Engine** (AI Video Deletion) — **[Glyph Obsidian]**
    - [ ] Pesquisa de portabilidade ONNX/Rust (Claude Code)
    - [ ] Implementação de quadmask conditioning no Canvas Fabric.js
    - [ ] Integração de inferência nativa no Rust Backend (via ONNX Runtime)

---
> [!IMPORTANT]
> **Prioridade Estratégica:** O desenvolvimento atual foca no **Glyph Core**, que servirá de alicerce tanto para a versão estável quanto para a **Obsidiana** (experimental/IA). A transição oficial para o nome **Glyph** está ocorrendo na Fase 6.

> [!TIP]
> Detalhes granulares no [Plano de Implementação v1.3.1](plano_implementacao_2026-03-31_v1.md) e no PSD.
