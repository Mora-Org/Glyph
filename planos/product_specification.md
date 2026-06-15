# Product Specification Document (PSD): Glyph — O Respiro do Ensaio Visual
Organização: Mora (Mora-Org)

## 1. Visão e Filosofia
A **Glyph** (anteriormente PEG) é uma ferramenta de autoria visual baseada no manifesto da organização **Mora**. Diferente de editores de vídeo lineares, o Glyph foca na "pausa necessária para a profundidade". O termo "Glyph" refere-se ao caractere individual de uma fonte, simbolizando o controle granular sobre a tipografia e a arte visual.

**Software como Escudo:** O Glyph é projetado para remover a burocracia técnica do motion design, permitindo que o autor foque na intenção e na estética, sem as amarras de softwares corporativos inorgânicos.

## 2. Arquitetura do Sistema
- **Desktop First:** Construído com Tauri (Rust) para segurança e performance nativa.
- **Frontend:** Next.js (React) + Tailwind CSS.
- **Graphic Engine:** Fabric.js (2D Canvas) para manipulação de "Glyphs" (caracteres) e assets em tempo real.
- **Render Engine:** Pipeline complexo de FFmpeg integrado via Rust.

## 3. Funcionalidades Principais

### 3.1. O Motor de "Lettering" (Coração do Projeto)
- **Granularidade do Glifo:** Divisão de strings em caracteres individuais com controle independente de posição, fonte, cor e efeitos.
- **Efeitos de Estética Orgânica:** "Tremor de Ansiedade", "Neon Flicker" e "Vibration" — capturando a textura da vida real.
- **Máscaras de Vídeo em Texto:** Renderização em tempo real de vídeos como preenchimento de caracteres.

### 3.2. Cenas e Timeline
- **Pausas Ativas:** Blocos de "respiro" configuráveis (Ruído VHS, Tela Preta, Ruído Estático).
- **Transições Suaves:** Corte seco (Cut) e Fade (Dissolver visual), respeitando o ritmo do ensaio.

### 3.3. Áudio e Sincronia (Avançado)
- **Gestão de Silêncio:** Filtros de redução de ruído (noise removal) focados em clareza de voz.
- **Multi-trilha:** Sincronização entre voz (VO) e trilhas de fundo (BGM).

### 3.4. Exportação Profissional
- **Aceleração por GPU:** Detecção inteligente de encoders (NVENC/AMF).
- **Fidelidade Visual:** Renderização 1:1 entre o que é visto no canvas e o arquivo final.

## 4. Roadmap de Fases (v1.4)
1. **Fases 0-4:** Infraestrutura, Store, Canvas e Motor de Lettering/GIF (Concluídas).
2. **Fase 5: Exportação:** Pipeline Rust/FFmpeg (Em Desenvolvimento).
3. **Fase 6: Branded Refactor:** Migração para identidade Glyph e Estética Mora (Em execução).
4. **Fase 7: Audio System:** Trilhas, Sync e Noise Removal.
5. **Fase 8: Artistic Tools:** Borracha (Eraser), Clipping Masks e HSL.
6. **Fase 9: VOID Engine (AI Video Inpainting):** Exclusivo **Glyph Obsidian**.

---

## 5. Estratégia de Produto: Core vs. Obsidian
O Glyph será bifurcado em duas rotas para equilibrar inovação de ponta e estabilidade extrema:

*   **Glyph Obsidian (Experimental/Heavy):** Foco em ferramentas de AI generativa e manipulação visual pesada. Inclui a **VOID Engine** e novos motores experimentais. Requisito de hardware elevado (12GB+ VRAM).
*   **Glyph Core (Stable/Light):** Foco no essencial bem feito. Leve, rápido e extremamente polido. Sem ferramentas de AI pesadas, garantindo portabilidade em hardware modesto.

---
> [!IMPORTANT]
> **Prioridade Estratégica:** O desenvolvimento atual foca no **Glyph Core**, que servirá de alicerce tanto para a versão estável quanto para a Obsidian (experimental/IA). A transição oficial para o nome **Glyph** está ocorrendo na Fase 6.
