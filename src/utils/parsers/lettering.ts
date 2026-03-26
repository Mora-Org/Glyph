import type { SceneElement } from '@/store/projectStore';

/**
 * Divide um elemento de texto em caracteres individuais,
 * preservando o kerning aproximado com base na largura da fonte.
 */
export function splitTextToChars(
  element: SceneElement,
  canvasEl: HTMLCanvasElement
): SceneElement[] {
  const text = element.text ?? '';
  if (!text.trim()) return [];

  const ctx = canvasEl.getContext('2d')!;
  const fontSize   = element.fontSize ?? 48;
  const fontFamily = element.fontFamily ?? 'sans-serif';
  ctx.font = `${fontSize}px ${fontFamily}`;

  const chars = Array.from(text); // suporta emojis e unicode
  const results: SceneElement[] = [];

  let cursorX = element.transform.x;

  chars.forEach((char, i) => {
    const metrics = ctx.measureText(char);
    const charWidth = metrics.width;

    results.push({
      ...element,
      id: `${element.id}_char_${i}`,
      text: char,
      isLetterChar: true,
      transform: {
        ...element.transform,
        x: cursorX,
        width: charWidth,
      },
    });

    cursorX += charWidth;
  });

  return results;
}

/**
 * Cria um SceneElement de texto com valores padrão.
 */
export function createTextElement(
  sceneId: string,
  partial: Partial<SceneElement> = {}
): SceneElement {
  const id = Math.random().toString(36).slice(2, 10);
  return {
    id,
    type: 'text',
    text: 'Texto',
    fontFamily: 'sans-serif',
    fontSize: 72,
    fill: '#ffffff',
    animationEffect: 'none',
    startTime: 0,
    endTime: 5,
    transform: {
      x: 100,
      y: 100,
      width: 300,
      height: 80,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    },
    zIndex: 0,
    ...partial,
  };
}
