import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ---------- Tipos ----------

export type AssetType = 'image' | 'video' | 'gif' | 'text';

export interface ElementTransform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export type AnimationEffect = 'none' | 'tremor' | 'neon' | 'ticker';

export interface SceneElement {
  id: string;
  type: AssetType;
  src?: string;            // caminho local para imagem/vídeo/gif
  text?: string;           // para elementos de texto
  startTime: number;
  endTime: number;
  transform: ElementTransform;
  zIndex: number;
  // Tipografia
  fontFamily?: string;
  fontSize?: number;
  fill?: string;           // cor do texto
  isLetterChar?: boolean;  // caractere individual vindo de um split
  animationEffect?: AnimationEffect;
}

export type TransitionType = 'cut' | 'fade';

export type PauseType = 'black' | 'vhs' | 'solid';

export interface Scene {
  id: string;
  name: string;
  duration: number;        // segundos
  elements: SceneElement[];
  transition: TransitionType;
}

export interface ActivePause {
  id: string;
  type: PauseType;
  duration: number;        // segundos
  color?: string;          // usado quando type === 'solid'
}

export type TimelineItem = Scene | ActivePause;

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

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineItem[]; // cenas e pausas em ordem
  audioTracks: AudioTrack[]; // Trilhas de áudio multi-camada
  activeSceneId: string | null;
  currentTime: number;      // Playhead global em segundos
}

// ---------- Store ----------

interface ProjectStore {
  project: Project | null;

  // Projeto
  createProject: (name: string) => void;
  closeProject: () => void;
  setActiveScene: (id: string) => void;
  seekTo: (time: number) => void;

  // Cenas
  addScene: () => void;
  removeScene: (id: string) => void;
  reorderTimeline: (from: number, to: number) => void;
  updateScene: (id: string, patch: Partial<Scene>) => void;

  // Pausas
  addPause: (type: PauseType, duration: number, color?: string) => void;

  // Elementos
  addElement: (sceneId: string, element: SceneElement) => void;
  updateElement: (sceneId: string, elementId: string, patch: Partial<SceneElement>) => void;
  removeElement: (sceneId: string, elementId: string) => void;

  // Áudio (Fase 7)
  addAudioTrack: (type: AudioTrack['type']) => void;
  removeAudioTrack: (id: string) => void;
  addAudioElement: (trackId: string, element: Omit<AudioElement, 'id'>) => void;
  updateAudioElement: (trackId: string, elementId: string, patch: Partial<AudioElement>) => void;
  removeAudioElement: (trackId: string, elementId: string) => void;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function now(): string {
  return new Date().toISOString();
}

function defaultScene(index: number): Scene {
  return {
    id: uid(),
    name: `Cena ${index}`,
    duration: 5,
    elements: [],
    transition: 'cut',
  };
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      project: null,

      createProject: (name) =>
        set(() => {
          const firstScene = defaultScene(1);
          return {
            project: {
              id: uid(),
              name,
              createdAt: now(),
              updatedAt: now(),
              timeline: [firstScene],
              audioTracks: [
                { id: uid(), name: 'Narração', type: 'vo', elements: [] },
                { id: uid(), name: 'Música de Fundo', type: 'bgm', elements: [] },
              ],
              activeSceneId: firstScene.id,
              currentTime: 0,
            },
          };
        }),

      closeProject: () => set({ project: null }),

      setActiveScene: (id) =>
        set((s) => ({
          project: s.project ? { ...s.project, activeSceneId: id } : null,
        })),

      seekTo: (time) =>
        set((s) => ({
          project: s.project ? { ...s.project, currentTime: time } : null,
        })),

      addScene: () =>
        set((s) => {
          if (!s.project) return {};
          const scenes = s.project.timeline.filter((i): i is Scene => 'elements' in i);
          const scene = defaultScene(scenes.length + 1);
          return {
            project: {
              ...s.project,
              updatedAt: now(),
              timeline: [...s.project.timeline, scene],
              activeSceneId: scene.id,
            },
          };
        }),

      removeScene: (id) =>
        set((s) => {
          if (!s.project) return {};
          const timeline = s.project.timeline.filter((i) => i.id !== id);
          const activeSceneId =
            s.project.activeSceneId === id
              ? (timeline.find((i): i is Scene => 'elements' in i)?.id ?? null)
              : s.project.activeSceneId;
          return { project: { ...s.project, updatedAt: now(), timeline, activeSceneId } };
        }),

      reorderTimeline: (from, to) =>
        set((s) => {
          if (!s.project) return {};
          const timeline = [...s.project.timeline];
          const [item] = timeline.splice(from, 1);
          timeline.splice(to, 0, item);
          return { project: { ...s.project, updatedAt: now(), timeline } };
        }),

      updateScene: (id, patch) =>
        set((s) => {
          if (!s.project) return {};
          return {
            project: {
              ...s.project,
              updatedAt: now(),
              timeline: s.project.timeline.map((i) =>
                i.id === id && 'elements' in i ? { ...i, ...patch } : i
              ),
            },
          };
        }),

      addPause: (type, duration, color) =>
        set((s) => {
          if (!s.project) return {};
          const pause: ActivePause = { id: uid(), type, duration, color };
          return {
            project: {
              ...s.project,
              updatedAt: now(),
              timeline: [...s.project.timeline, pause],
            },
          };
        }),

      addElement: (sceneId, element) =>
        set((s) => {
          if (!s.project) return {};
          return {
            project: {
              ...s.project,
              updatedAt: now(),
              timeline: s.project.timeline.map((i) =>
                i.id === sceneId && 'elements' in i
                  ? { ...i, elements: [...i.elements, element] }
                  : i
              ),
            },
          };
        }),

      updateElement: (sceneId, elementId, patch) =>
        set((s) => {
          if (!s.project) return {};
          return {
            project: {
              ...s.project,
              updatedAt: now(),
              timeline: s.project.timeline.map((i) => {
                if (i.id !== sceneId || !('elements' in i)) return i;
                return {
                  ...i,
                  elements: i.elements.map((el) =>
                    el.id === elementId ? { ...el, ...patch } : el
                  ),
                };
              }),
            },
          };
        }),

      removeElement: (sceneId, elementId) =>
        set((s) => {
          if (!s.project) return {};
          return {
            project: {
              ...s.project,
              updatedAt: now(),
              timeline: s.project.timeline.map((i) => {
                if (i.id !== sceneId || !('elements' in i)) return i;
                return { ...i, elements: i.elements.filter((el) => el.id !== elementId) };
              }),
            },
          };
        }),

      // --- Áudio (Fase 7) ---

      addAudioTrack: (type) =>
        set((s) => {
          if (!s.project) return {};
          const track: AudioTrack = {
            id: uid(),
            name: type === 'vo' ? 'Narração' : 'Trilha Sonora',
            type,
            elements: [],
          };
          return {
            project: {
              ...s.project,
              updatedAt: now(),
              audioTracks: [...s.project.audioTracks, track],
            },
          };
        }),

      removeAudioTrack: (id) =>
        set((s) => {
          if (!s.project) return {};
          return {
            project: {
              ...s.project,
              updatedAt: now(),
              audioTracks: s.project.audioTracks.filter((t) => t.id !== id),
            },
          };
        }),

      addAudioElement: (trackId, element) =>
        set((s) => {
          if (!s.project) return {};
          const newElement: AudioElement = { ...element, id: uid() };
          return {
            project: {
              ...s.project,
              updatedAt: now(),
              audioTracks: s.project.audioTracks.map((t) =>
                t.id === trackId ? { ...t, elements: [...t.elements, newElement] } : t
              ),
            },
          };
        }),

      updateAudioElement: (trackId, elementId, patch) =>
        set((s) => {
          if (!s.project) return {};
          return {
            project: {
              ...s.project,
              updatedAt: now(),
              audioTracks: s.project.audioTracks.map((t) => {
                if (t.id !== trackId) return t;
                return {
                  ...t,
                  elements: t.elements.map((el) =>
                    el.id === elementId ? { ...el, ...patch } : el
                  ),
                };
              }),
            },
          };
        }),

      removeAudioElement: (trackId, elementId) =>
        set((s) => {
          if (!s.project) return {};
          return {
            project: {
              ...s.project,
              updatedAt: now(),
              audioTracks: s.project.audioTracks.map((t) => {
                if (t.id !== trackId) return t;
                return { ...t, elements: t.elements.filter((el) => el.id !== elementId) };
              }),
            },
          };
        }),
    }),
    {
      name: 'peg-project',
    }
  )
);
