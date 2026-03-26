declare module 'gifler' {
  interface GiflerAnimation {
    animate(canvas: HTMLCanvasElement, onFrame?: () => void): void;
    stop(): void;
  }
  function gifler(src: string): GiflerAnimation;
  export default gifler;
}
