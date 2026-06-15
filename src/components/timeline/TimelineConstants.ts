/**
 * Constantes compartilhadas para a Timeline.
 */
import type { SceneElement } from '@/store/projectStore';

export const PIXELS_PER_SECOND = 40;
export const TRACK_HEIGHT      = 28;
export const MIN_DURATION      = 0.1; // Segundos mínimos para uma cena
export const GUTTER_WIDTH      = 128; // Largura da coluna de labels (w-32), separa gutter do eixo de tempo
export const RULER_HEIGHT      = 24;  // Altura da régua global (h-6)
export const SCENE_LANE_HEIGHT = 80;  // Altura da faixa de cenas

// Cor por tipo de elemento (ElementTimeline). Disciplina de acento: o chip de 3 letras
// usa cor sólida; o bloco usa o mesmo hue translúcido. image=accent é o único uso do
// amarelo fora do playhead — mantido num chip minúsculo, nunca como fill de ação.
export const TYPE_TAG_FILL: Record<SceneElement['type'], string> = {
  image: '#E8B547',
  video: '#C8485C',
  gif:   '#C8485C',
  text:  '#F0E7D5',
};
export const TYPE_BLOCK_FILL: Record<SceneElement['type'], string> = {
  image: 'rgba(232,181,71,0.40)',
  video: 'rgba(200,72,92,0.40)',
  gif:   'rgba(200,72,92,0.40)',
  text:  'rgba(240,231,213,0.50)',
};
