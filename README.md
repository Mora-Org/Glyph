# Glyph — O Respiro do Ensaio Visual

Software desktop open-source focado em **autoria visual, tipografia avançada e ensaios experimentais**. O Glyph afasta-se da edição linear tradicional para focar no controle granular da estética e da narrativa visual.

## A Visão de Futuro: Core vs. Obsidian

O projeto seguirá dois caminhos complementares para atender diferentes necessidades de hardware e criatividade:

*   **Glyph Obsidian (Experimental/Heavy):** Nosso "playground" de inovação. Inclui funcionalidades de IA de ponta, como a **VOID Engine** (AI Video Inpainting consciente de física). Exige hardware robusto (GPUs com 12GB+ VRAM) e pode apresentar instabilidades devido à natureza experimental das features.
*   **Glyph Core (Stable/Light):** A versão essencial, extremamente leve, polida e estável. Para quem precisa de um motor de lettering e composição visual sólido sem a necessidade de IA generativa pesada.

**Atualmente, estamos construindo o Glyph Core, que servirá de alicerce para ambos os caminhos.**

## Stack Tecnológico

| Camada | Tecnologia |
|---|---|
| Desktop Wrapper | [Tauri](https://tauri.app/) (Rust) |
| Frontend / UI | React ou Next.js (Static Export) |
| Canvas / Drag & Drop | `@dnd-kit/core` + `Fabric.js` ou `Konva.js` |
| Renderização | FFmpeg (execução nativa via Tauri) |

## Funcionalidades

### Gerenciamento de Projetos e Assets
- Dashboard com projetos recentes
- Leitura direta de pastas locais (sem upload)
- Suporte nativo a Fontes (`.ttf`, `.otf`), Imagens, Vídeos e GIFs

- **Pausas Ativas**: blocos de tempo vazios (tela preta, ruído VHS, cor sólida)

### Tipografia Avançada (Lettering Dinâmico)
- Controle por caractere individual: posição X/Y, tamanho, cor e fonte
- Sobreposição de letras dentro de uma mesma palavra
- **Clipping Mask** — vídeo reproduzido dentro do contorno das letras
- Animações nativas: tremor de ansiedade, piscar estilo neon, letreiro de quadrinhos

### Filtros e Efeitos Orgânicos
- Máscaras em imagens: recorte estilo jornal rasgado, bordas irregulares, remoção de fundo
- Preview com filtros CSS; exportação via filtros FFmpeg equivalentes

### Reusabilidade (Common Places)
- Cenas personalizadas salvas em biblioteca local de componentes
- Instanciamento em projetos futuros para consistência estética

### Exportação e Hardware
- Detecção automática de hardware e sugestão de pipeline de renderização
- Modos: Single Thread / Multithread / Aceleração GPU (NVENC · AMD AMF)
- Cross-platform: Windows e Linux, exportação em `.mp4` e `.mov`

## Requisitos

- [Rust](https://www.rust-lang.org/) (para compilar o Tauri)
- [Node.js](https://nodejs.org/) 18+
- [FFmpeg](https://ffmpeg.org/) instalado e disponível no `PATH`

## Como rodar (em desenvolvimento)

```bash
# Instalar dependências
npm install

# Rodar em modo dev
npm run tauri dev

# Gerar build de produção
npm run tauri build
```

## Estrutura do Projeto

- `src/`: Frontend em Next.js (Canvas, Timeline, Typography).
- `src-tauri/`: Backend em Rust (FFmpeg Bridge).
- `tests/`: Testes automatizados (Unitários e Integração).
- `team_guide.md`: Instruções para Claude Code e TestSprite.

## Licença

Open-source — licença a definir.
