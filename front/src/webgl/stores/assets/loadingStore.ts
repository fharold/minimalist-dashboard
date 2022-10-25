import create from 'zustand';

export type LoadingState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean, totalSize?: number) => void;

  totalSize: number;
  loadedBytes: Map<string, number>;
  setLoadedBytes: (url: string, loadedBytes: number) => void;
  resetLoadedBytes: () => void;

  updatePercentageLoaded: () => void;
  percentageLoaded: number;

  loadingError: Error | null;
  setLoadingError: (error: Error | null) => void;
}

export const loadingStore = create<LoadingState>((set, get) => ({
  isLoading: true,
  setIsLoading: (isLoading, totalSize = 0) => set({isLoading: isLoading, totalSize: totalSize}),

  totalSize: 0,
  loadedBytes: new Map<string, number>(),
  setLoadedBytes: (url, loadedBytes) => {
    const newLoadedBytes = new Map(get().loadedBytes).set(url, loadedBytes);
    set({
      loadedBytes: newLoadedBytes
    });
    get().updatePercentageLoaded();
  },
  resetLoadedBytes: () => set({loadedBytes: new Map<string, number>(), totalSize: 0}),

  updatePercentageLoaded: () => {
    let loadedBytesSum = 0;
    get().loadedBytes.forEach(value => loadedBytesSum += value);

    set({
      percentageLoaded: loadedBytesSum * 100 / get().totalSize
    });
  },
  percentageLoaded: 0,

  loadingError: null,
  setLoadingError: (error) => set({loadingError: error})
}));