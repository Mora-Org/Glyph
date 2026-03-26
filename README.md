# PEG — Gerador de Ensaios Visuais

Software desktop open-source para criação de ensaios visuais e apresentações com controle estético granular. Focado em assets (imagens, GIFs, vídeos) e cenas programáveis — sem a complexidade de editores de vídeo tradicionais como Premiere ou DaVinci.

## Por que PEG?

Editores de vídeo convencionais são pensados para produção linear. O PEG é pensado para **lettering dinâmico, composição visual expressiva e controle total de tipografia** — ideal para criadores que trabalham com identidade visual, motion design e ensaios audiovisuais.

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

### Motor de Cenas (Timeline + Canvas)
- Projeto estruturado como lista de **Cenas** com duração configurável
- Drag & drop para posicionar, redimensionar e sobrepor elementos
- Cada elemento possui sua própria linha do tempo dentro da cena
- Transições: corte seco, fade e outros
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
