# Plano de Implementação: Fase 7 — Áudio & Sync (v2.2)
Data: 2026-04-05
Versão: 1.1 (Revisão Técnica Antigravity)

Este plano detalha a implementação do sistema de áudio multi-trilha e sincronia global no **Glyph**.

## 1. Abstração de Tempo: Global vs. Cena
O Glyph migrará para um modelo de tempo linear. Precisamos de uma lógica matemática para converter o `currentTime` (global) na cena ativa:

- **Função `getSceneAtTime(t)`:** Itera sobre a `timeline`, somando as durações até encontrar o índice correspondente ao tempo global `t`.
- **Sincronia Canvas-Áudio:** Para evitar latência, o áudio será controlado via `useRef`. No loop de `requestAnimationFrame` do Canvas, faremos `audio.currentTime = globalTime`.

## 2. Modelo de Dados Detalhado (`src/store/projectStore.ts`)
Para garantir precisão, o objeto `AudioTrack` será estruturado assim:

```typescript
export interface AudioElement {
  id: string;
  src: string;          // Caminho local do arquivo
  startTime: number;    // Início no Tempo Global (segundos)
  duration: number;     // Duração do recorte
  offset: number;       // Início dentro do arquivo original
  volume: number;       // Ganho (0.0 a 1.0)
  noiseReduction: boolean;
}

export interface AudioTrack {
  id: string;
  name: string;
  type: 'vo' | 'bgm';   // Narração ou Fundo
  elements: AudioElement[];
}
```

E no `ProjectState`:
- `audioTracks: AudioTrack[]`
- `currentTime: number` (Playhead Global)

## 3. Componentes de UI (`src/components/timeline/`)
| Componente | Função |
|---|---|
| `GlobalRuler` | Régua de tempo (soma das cenas). Suporte a zoom. |
| `Playhead` | Linha de scrubbing vertical com lógica de "Snap" em transições. |
| `AudioTrackArea` | Área para gerenciar VO (Voz) e BGM (Música). |

## 4. Motor de Exportação (`src/utils/ffmpeg/ffmpegBuilder.ts`)
- **Noise Removal:** Filtro `afftdn` (FFT Denoiser) nas trilhas de VO.
- **Sincronia:** Filtro `adelay` para posicionar áudios no tempo global.
- **Mixagem:** Filtro `amix` para combinar narrações e fundo.

---

## 5. Ordem de Implementação (Roadmap Interno)
Para minimizar riscos e garantir entregas incrementais estáveis:

1.  **Store:** Atualização do `ProjectStore` com os novos tipos e `currentTime`.
2.  **GlobalRuler:** Implementação da régua de tempo baseada na duração total.
3.  **Playhead:** Implementação do cursor com lógica de Scrubbing e Snapping.
4.  **AudioTrackArea:** UI para visualização das trilhas (blocos iniciais).
5.  **Export Integration:** Atualização do `ffmpegBuilder.ts` com mixagem e noise removal.
6.  **Scene Handles (Trimming):** Implementação das alças de redimensionamento (Item complexo; requer atualização dos testes TC010/TC012).

---

## 6. Critérios de Aceite (QA)
- [ ] O playhead deve se mover suavemente sobre as cenas.
- [ ] O áudio narração (VO) deve ter redução de ruído perceptível quando ativado.
- [ ] A música de fundo (BGM) não deve interromper ao trocar de cena.
- [ ] Exportação final deve conter todos os áudios mixados.

> [!CAUTION]
> **Trimagem de Cenas:** Redimensionar a duração de uma cena impacta todos os elementos de áudio que vêm depois dela no tempo global. A lógica de `updateSceneDuration` deve garantir que os `startTime` dos áudios permaneçam relativos ou sejam deslocados corretamente.
