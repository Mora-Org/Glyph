# Documento de Especificação — Gerador de Ensaios Visuais (Desktop)

## 1. Visão Geral do Sistema

Um software desktop open-source focado na criação de ensaios visuais e apresentações de alta customização estética. O diferencial é o **controle granular sobre tipografia, cenas e hardware**, dispensando a complexidade de editores de vídeo tradicionais (Premiere/DaVinci) em favor de um fluxo de trabalho focado em assets (imagens, gifs, vídeos) e cenas programáveis.

---

## 2. Stack Tecnológico Sugerido (Desktop-First)

> Objetivo: tecnologias de interface web rodando nativamente no desktop.

- **Desktop Wrapper:** Tauri (recomendado). Construído em Rust — absurdamente mais leve e rápido que o Electron. Permite usar o frontend web já dominado pelo time.
- **Frontend (Interface UI):** React ou Next.js (em modo Static Export).
- **Manipulação de UI / Drag & Drop:**
  - `@dnd-kit/core` — mover elementos na tela livremente
  - `fabric.js` ou `Konva.js` — Canvas 2D para desenhar, rotacionar e arrastar imagens e textos
- **Motor de Renderização (Backend Local):** FFmpeg. Padrão ouro para processamento de vídeo. Executado nativamente via comandos do Tauri com precisão de frames.

---

## 3. Core Features & Estrutura

### A. Gerenciamento de Assets e Projetos

- **Dashboard:** Tela inicial com projetos recentes.
- **Explorador Local:** Leitura direta de pastas do sistema do usuário, sem necessidade de upload.
- **Organização:** Suporte a separação nativa de:
  - Fontes (`.ttf`, `.otf`)
  - Imagens
  - Vídeos
  - GIFs

---

### B. Motor de Cenas (Timeline e Canvas)

- **Estrutura Sequencial:** O projeto é uma lista de objetos `Cena`. Cada cena possui sua própria `duração_total` em segundos.
- **Controle de Elementos (Canvas):**
  - Interface visual com drag & drop para posicionar, redimensionar e sobrepor elementos
  - Cada elemento (imagem, texto) possui uma linha do tempo própria dentro da cena
    - *Exemplo: a cena dura 10s, mas a Imagem A aparece do segundo 2 ao 8*
- **Transições entre cenas:**
  - Corte seco
  - Fade
  - Outros tipos configuráveis
- **Pausas Ativas:** Blocos de tempo vazios configuráveis
  - Tela preta
  - Ruído estático / VHS
  - Cor sólida

---

### C. Manipulação Avançada de Tipografia

**Controle por Caractere (Lettering Dinâmico):**
- Quebrar uma string em caracteres individuais
- Mover o eixo X/Y de uma única letra (ex: sobrepor o "O" no "D")
- Tamanhos, cores e fontes diferentes dentro da mesma palavra

**Efeitos Visuais em Textos:**
- **Clipping Mask (Vídeo no Texto):** Usar o texto como máscara de recorte para que um vídeo seja reproduzido apenas "dentro" das letras
- **Animações Nativas (Canvas):**
  - Tremor de ansiedade
  - Piscar estilo placa de neon de Las Vegas
  - Letreiro de quadrinhos

---

### D. Sistema de Filtros e Efeitos Orgânicos

- Aplicação de máscaras em imagens:
  - Recorte estilo jornal rasgado
  - Bordas irregulares
  - Remoção de fundo
- **Estratégia de renderização:**
  - Preview: filtros CSS nativos no frontend (leve e responsivo)
  - Exportação: filtros equivalentes em FFmpeg (qualidade e precisão máxima)

---

### E. Reusabilidade (Common Places)

- Sistema de templates de cenas
- Uma cena altamente customizada pode ser salva em uma **biblioteca local de Componentes/Cenas**
- O usuário pode instanciar essa cena em qualquer projeto futuro, mantendo a consistência estética do canal

---

### F. Motor de Exportação e Hardware

**Seletor Automático de Perfil:**
- O software escaneia o hardware local e sugere a melhor pipeline de renderização

**Controle Manual do Usuário:**
- **Single Thread** — mais lento; não trava o PC para outras tarefas
- **Multithread** — usa toda a CPU
- **Aceleração via GPU:**
  - NVENC (Nvidia)
  - AMF (AMD)

**Cross-platform:**
- FFmpeg garante compatibilidade perfeita entre Windows e Linux
- Formatos de saída: `.mp4`, `.mov`
