import create from 'zustand';

export type CanvasStoreProps = {
  isHidden: boolean;
  setIsHidden: (value: boolean) => void;
}

export const canvasStore = create<CanvasStoreProps>((set) => ({
  isHidden: true,
  setIsHidden: (value) => set({isHidden: value}),
}));
