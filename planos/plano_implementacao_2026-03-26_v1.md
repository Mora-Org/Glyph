# Plano de Implementação: PEG Functional MVP (v1.2)
Data: 2026-03-26

Este plano foi revisado para incluir assets de vídeo, pausas ativas e transições, garantindo total alinhamento com a `base.md`.

---

## 🔘 Fase 0: Setup & Ambiente de Desenvolvimento (OK)
- [x] **Inicialização do Tauri** (`tauri init`).
- [x] **Instalação de Dependências** (Fabric, Zustand, dnd-kit).
- [x] **Teste de Bridge JS <-> Rust**.

---

## 🟢 Fase 1: Fundação & Workspace Setup (OK)
- [x] **Design System**: Tailwind + Dark Premium.
- [x] **Estado Global**: `src/store/projectStore.ts` (JSON persistente).
- [x] **UI Base**: Sidebar de assets e seletor de projetos.

---

## 🟦 Fase 2: O Motor do Canvas (Fabric.js) (OK)
- [x] **Integração React-Fabric**: Hook `useFabricCanvas`.
- [x] **Suporte a Assets Estáticos**: Imagens (`.png`, `.jpg`).
- [x] **Suporte a Vídeo**: 
    - [x] Implementar carregamento de `.mp4`/`.mov` via tag `<video>`.
    - [x] Renderizar frame-a-frame no Canvas do Fabric.
- [x] **Transformações**: Sincronização em tempo real com o Store.

---

## 🟨 Fase 3: Estrutura de Cenas & Tempo
- [ ] **Cenas de Conteúdo**:
    - [ ] Lista reordenável de cenas.
    - [ ] Transições: Implementar lógica de **Corte Seco** e **Fade** (opacidade).
- [ ] **Pausas Ativas (Active Pauses)**:
    - [ ] Gerar bloco de cena com preenchimento: Tela Preta, Ruído VHS/Estático, Cor Sólida.
- [ ] **Timeline Interna**: Tracks de visibilidade e timestamps por elemento.

---

## ⚡ Fase 4: Tipografia & GIFs (Expert)
- [ ] **Lettering Engine**: Split de string em letras individuais (+ Kerning).
- [ ] **Suporte a GIFs**: Integração de lib externa para frames de GIF no Canvas.
- [ ] **Filtros Dinâmicos**: Efeito de tremor (vibration).

---

## 🚀 Fase 5: Pipeline de Exportação (FFmpeg)
- [ ] **Comandos Complexos**: Mapear Canvas + Timeline para filtros FFmpeg.
- [ ] **Export Bridge**: Comando Rust com progresso real.
- [ ] **Aceleração**: Detecção automática de GPU.

---

## 🧪 Verificação (TestSprite)
- [ ] Validar sincronia de áudio/vídeo no preview do Canvas.
- [ ] Testar se transições de Fade funcionam corretamente no export final.
