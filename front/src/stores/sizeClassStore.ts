import create, {GetState, SetState} from 'zustand';
import {StoreApiWithSubscribeWithSelector, subscribeWithSelector} from "zustand/middleware";

export type SizeState = {
  width: number;
  height: number;
  sizeClass: string;
  portrait: any;
  fovMultiplier: number;
  setSizeClass: (width: number, height: number) => void;
}

const sizeClassStore = create<SizeState, SetState<SizeState>, GetState<SizeState>, StoreApiWithSubscribeWithSelector<SizeState>>(subscribeWithSelector(set => ({
  width: 0,
  height: 0,
  sizeClass: '',
  portrait: false,
  fovMultiplier: 1,

  setSizeClass: (width, height) => {
    // const portrait = window.innerHeight > window.innerWidth;
    const portrait = height > width;
    const sizeClass = getSizeClass();
    set({
      width: width,
      height: height,
      portrait: portrait,
      sizeClass: sizeClass,
      fovMultiplier: getFovMultiplier(portrait, sizeClass)
    });
  }
})));

const getFovMultiplier = (portrait: boolean, sizeClass: string): number => {
  switch (sizeClass) {
    case 'tablet' :
      return portrait ? 1.5 : 1;
    case 'mobile':
      return portrait ? 2 : 1.5;
    default:
      return portrait ? 1.25 : 1;
  }
};

const getSizeClass = (): string => {
  const area = window.screen.width * window.screen.height;

  // desktop >= 1_500_000
  // tablet limit < 1_500_000
  // mobile limit < 500_000

  let sizeClass = 'desktop';
  if (area >= 500_000 && area < 1_500_000) sizeClass = 'tablet';
  if (area < 500_000) sizeClass = 'mobile';

  return sizeClass;
};

export {sizeClassStore};
