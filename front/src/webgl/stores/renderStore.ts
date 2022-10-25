import create from 'zustand';

export type RenderStoreProps = {
  isIdle: boolean;
  forceRender: boolean;
  pauseRender: boolean;

  /** Set via useIdle hook from react-use */
  setIsIdle: (value: boolean) => void;
  /** Used when playing animation for instance */
  setForceRender: (value: boolean) => void;
  /** Used when viewing video for instance */
  setPauseRender: (value: boolean) => void;
}

export const renderStore = create<RenderStoreProps>((set) => ({
  isIdle: false,
  forceRender: false,
  pauseRender: true, // initially paused

  setIsIdle: (value) => set({isIdle: value}),
  setForceRender: (value) => set({forceRender: value}),
  setPauseRender: (value) => set({pauseRender: value})
}));