import type { TimelineItem } from '@/store/projectStore';

/**
 * Retorna a duração total do projeto (soma de todas as cenas e pausas).
 */
export function getTotalDuration(timeline: TimelineItem[]): number {
  return timeline.reduce((acc, item) => acc + item.duration, 0);
}

/**
 * Retorna o item da timeline (Cena ou Pausa) que está ativo no tempo global t.
 * Também retorna o offset local dentro desse item.
 */
export function getItemAtTime(timeline: TimelineItem[], t: number): {
  item: TimelineItem | null;
  localTime: number;
  index: number;
} {
  let accumulated = 0;
  for (let i = 0; i < timeline.length; i++) {
    const item = timeline[i];
    if (t >= accumulated && t < accumulated + item.duration) {
      return {
        item,
        localTime: t - accumulated,
        index: i,
      };
    }
    accumulated += item.duration;
  }
  
  // Se t for exatamente a duração total, retorna o último item
  const total = getTotalDuration(timeline);
  if (t >= total && timeline.length > 0) {
    const last = timeline[timeline.length - 1];
    return {
      item: last,
      localTime: last.duration,
      index: timeline.length - 1,
    };
  }

  return { item: null, localTime: 0, index: -1 };
}

/**
 * Retorna o tempo global de início de um item específico (pelo ID).
 */
export function getItemStartTime(timeline: TimelineItem[], itemId: string): number {
  let accumulated = 0;
  for (const item of timeline) {
    if (item.id === itemId) return accumulated;
    accumulated += item.duration;
  }
  return -1;
}
