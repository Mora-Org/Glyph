# CLAUDE.md — PEG: Gerador de Ensaios Visuais

## Sobre o Projeto

PEG é um software desktop open-source para criação de ensaios visuais e apresentações com controle estético granular. Foco em lettering dinâmico, composição visual expressiva e tipografia — não é um editor de vídeo linear.

## A Equipe

| Membro | Papel |
|---|---|
| **César (Boss)** | Visionário e tomador de decisões final |
| **Antigravity** | Gerente de Planejamento — arquitetura, PSD, `planos/tarefas.md`, direcionamento técnico |
| **Claude Code** | Programador executor — implementa os planos seguindo boas práticas |
| **TestSprite** | QA — valida as entregas e garante que nada quebre |

## Regras de Fluxo de Trabalho

### Antes de Escrever Código
1. Ler `planos/product_specification.md`
2. Ler o plano de implementação mais recente em `planos/`
3. Verificar o backlog atual em `planos/tarefas.md`

### Após Cada Entrega Significativa
- Atualizar `fixes/patch_notes.md` com as mudanças e aprendizados
- Se um bug foi corrigido, registrar em `fixes/bug_fix.md` com a solução detalhada

## Stack Tecnológico

| Camada | Tecnologia |
|---|---|
| Desktop Wrapper | Tauri (Rust) |
| Frontend / UI | Next.js (Static Export) |
| Canvas / Drag & Drop | `@dnd-kit/core` + `Fabric.js` |
| Estado Global | `Zustand` |
| Renderização | FFmpeg (via comandos Tauri) |
| Linguagem | TypeScript |

## Estrutura do Projeto

```
src/                 # Frontend (Next.js)
  app/               # Next.js App Router
  components/
    canvas/          # Lógica Fabric.js
    timeline/        # UI de sequenciamento de cenas
    typography/      # Componentes de lettering
    ui/              # Elementos de UI compartilhados
  hooks/             # Custom hooks para Tauri/FFmpeg
  store/             # Zustand — estado do projeto JSON
  utils/
    ffmpeg/          # Builders de comandos FFmpeg
    parsers/         # Cena → JSON e vice-versa

src-tauri/           # Backend (Rust)
  src/main.rs        # Comandos Tauri para FFmpeg
  tauri.conf.json    # Configuração do app

planos/              # Documentação e tarefas (Antigravity)
fixes/               # Histórico de mudanças e bugs
tests/               # Suítes de teste (TestSprite)
  unit/
  integration/
```

## Comandos Principais

```bash
npm install          # Instalar dependências
npm run dev          # Next.js dev (frontend isolado)
npm run tauri dev    # App completo em modo dev
npm run tauri build  # Build de produção
npm run test:unit    # Testes unitários (TestSprite)
npm run test:integration  # Testes de integração
```

## Contexto de Desenvolvimento

- **Plataforma-alvo:** Windows e Linux
- **Formatos de saída:** `.mp4`, `.mov`
- **Requisitos do sistema:** Rust, Node.js 18+, FFmpeg no PATH
- **Licença:** Open-source (a definir)

## Princípios de Código

- Não adicione complexidade além do que foi pedido
- Preview usa filtros CSS; exportação usa FFmpeg equivalente
- Estado do projeto é serializado como JSON (estrutura de cenas)
- Comandos FFmpeg são construídos via builders em `src/utils/ffmpeg/`
- Não faça mock de comandos Tauri nos testes de integração — use o real

---
## Nota de limpeza de disco (Claude / 2026-06-28)
As pastas recriaveis deste projeto (node_modules, .venv, venv, __pycache__, dist, build, .next, target) podem ter sido removidas para liberar espaco em disco. NAO trate a ausencia delas como problema do projeto -- restaure com o gerenciador de pacotes (npm install / pip install / cargo build). O codigo-fonte e os dados versionados estao intactos.
