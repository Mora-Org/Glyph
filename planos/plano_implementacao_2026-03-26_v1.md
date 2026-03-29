# Plano de Implementação: PEG Functional MVP (v1.3.1)
Data: 2026-03-26

Este é o documento mestre de evolução do PEG. Mantém o histórico completo das fases e detalha os próximos passos avançados.

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
- [x] **Suporte a Vídeo**: Renderização frame-a-frame no Canvas.
- [x] **Transformações**: Sincronização em tempo real com o Store.

---

## 🟨 Fase 3: Estrutura de Cenas & Tempo (OK)
- [x] **Cenas de Conteúdo**: Lista reordenável e transições (Cut/Fade).
- [x] **Pausas Ativas**: Gerador de Preto, VHS/Estático e Cor Sólida.
- [x] **Timeline Interna**: Tracks de visibilidade e timestamps.

---

## ⚡ Fase 4: Tipografia & GIFs (EM TESTES [/])
- [x] **Lettering Engine**: Split de string em letras individuais (+ Kerning).
- [x] **Suporte a GIFs**: Animação de GIFs via `gifler`.
- [/] **Filtros Dinâmicos**: Efeitos de Tremor, Neon e Ticker (Aguardando validação do TestSprite).

---

## 🚀 Fase 5: Pipeline de Exportação (FFmpeg)
**Foco:** Geração do vídeo final.

- [ ] **Mapeamento FFmpeg**: Converter JSON para argumentos complexos `-vf`.
- [ ] **Bridge de Exportação**: Comando Rust com progresso real.
- [ ] **Aceleração**: Detecção automática de GPU.

---

## 🎵 Fase 6: Audio Engine & Sincronização (AVANÇADO)
**Foco:** Manipulação de som e áudio profissional.

- [ ] **Gestão de Múltiplas Trilhas**
    - [ ] Adicionar suporte a `.mp3`, `.wav`, `.ogg`.
    - [ ] Sistema de camadas: Trilhas de Ambiente (BGM) vs. Voz (VO).
- [ ] **Edição de Áudio na Timeline**
    - [ ] Implementar Sliders de Volume por trilha.
    - [ ] Suporte a Fade-in / Fade-out (curvas de áudio).
- [ ] **Processamento de Sinal (FFmpeg)**
    - [ ] **Remoção de Ruído**: Implementar preset de filtro `anlmdn` para limpar vozes.
    - [ ] **Normalização**: Garantir que o volume final esteja balanceado.
- [ ] **Sincronia Precisa**: Garantir que o áudio não "atrase" em relação ao vídeo nas transições.

---

## 🎨 Fase 7: Ferramentas Artísticas (AVANÇADO)
**Foco:** Edição destrutiva e refinamento visual.

- [ ] **Edição de Imagem e Fonte (Eraser Tool)**
    - [ ] Implementar **Borracha** (Fabric.js `EraserBrush`) para apagar partes de uma imagem ou caractere de texto.
    - [ ] **Inversão de Máscara**: Transformar o que foi "apagado" em uma janela de visualização (clipping).
- [ ] **Refinamento de Cor e Estilo**
    - [ ] **HSL/HSV Adjusters**: Sliders para trocar a cor de um elemento sem mudar sua textura (ex: mudar o tom de uma roupa no vídeo).
    - [ ] **Recorte de Borda**: Ferramenta para suavizar ou "esfarelar" a borda de elementos (efeito orgânico).
- [ ] **Mascaramento Dinâmico**
    - [ ] Clipping Mask de vídeo dentro de uma imagem estática.
