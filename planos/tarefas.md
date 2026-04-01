# Controle de Fases — PEG
Data: 2026-03-26

Este arquivo rastreia o progresso macro das fases (v1.3.1).

- [x] **Fase 0: Setup & Ambiente** (OK)
- [x] **Fase 1: Fundação** (OK)
- [x] **Fase 2: Motor do Canvas** (OK)
- [x] **Fase 3: Cenas e Timeline** (OK)
- [/] **Fase 4: Tipografia & GIF** (EM TESTES — TestSprite validando efeitos)
- [/] **Fase 5: Exportação** (EM DESENVOLVIMENTO)
    - [ ] **Export Engine (JSON → PNG Sequence)**
        - [ ] Criar `src/utils/ffmpeg/frameExporter.ts` para renderização silenciosa do Canvas frame-a-frame.
        - [ ] Implementar buffer local de pastas temporárias via Tauri FS.
    - [ ] **FFmpeg Builder (Sequence + Overlays)**
        - [ ] Criar `src/utils/ffmpeg/ffmpegBuilder.ts` para montar o comando com input de série de imagens.
        - [ ] Integrar assets secundários (vídeos e GIFs) via `filter_complex overlay`.
    - [ ] **Rust Bridge (Performance & Monitor)**
        - [ ] Criar `src-tauri/src/gpu.rs` para detecção de HW acceleration.
        - [ ] Criar `src-tauri/src/export.rs` com spawn de processo FFmpeg e progress emitter.
    - [ ] **UI de Finalização**
        - [ ] Criar `ExportModal.tsx` com barra de progresso e estatísticas de render.
- [ ] **Fase 6: Audio & Sync** (Avançado: Noise Removal, Multi-track)
- [ ] **Fase 7: Ferramentas Artísticas** (Avançado: Eraser, HSL, Clipping)

---
> [!TIP]
> Detalhes granulares no [Plano de Implementação v1.3.1](plano_implementacao_2026-03-26_v1.md).
