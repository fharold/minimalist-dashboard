import create, {GetState, SetState} from 'zustand';
import {StoreApiWithSubscribeWithSelector, subscribeWithSelector} from 'zustand/middleware';
import produce from 'immer';
import {Vector3} from 'three';

export type ControlsProps = {
  enabled: boolean;
  enableDamping: boolean;
  enablePan: boolean;
  enableRotate: boolean;
  enableZoom: boolean;
  autoRotate: boolean;
  autoRotateSpeed: number;
  groundThreshold: number | null;
};

export type ControlsState = {
  config: ControlsProps;
  setConfig: (newConfig: Partial<ControlsProps>) => void;

  getTarget: () => Vector3;
  setTarget: (pos: Vector3) => void;
  saveState: () => void;
  update: () => void;
  reset: () => void;
};

const initialState = {
  enabled: false,
  enableDamping: false,
  enablePan: false,
  enableRotate: false,
  enableZoom: false,
  autoRotate: false,
  autoRotateSpeed: 1,
  groundThreshold: null
};

export const controlsStore = create<ControlsState, SetState<ControlsState>, GetState<ControlsState>, StoreApiWithSubscribeWithSelector<ControlsState>>(subscribeWithSelector((set, get) => ({

  config: initialState as ControlsProps,
  setConfig: (newConfig) => {
    const config = produce(get().config, draft => {
      return {...draft, ...newConfig};
    });

    set({config: config as ControlsProps});
  },

  getTarget: () => new Vector3(),
  setTarget: (pos) => {},
  saveState: () => {},
  update: () => {},
  reset: () => {},
})));