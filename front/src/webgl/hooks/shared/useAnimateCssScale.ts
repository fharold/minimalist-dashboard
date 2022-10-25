import {useRef} from 'react';
import {useFrame} from '@react-three/fiber';

export const useAnimateCssScale = (speed: number, range: { min: number, max: number }, forceMax: boolean = false) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useFrame(() => {
    if (ref.current) {
      const scale = forceMax ?
        range.max :
        range.min
        + (1 + Math.sin(speed * performance.now() / 1000)) / 2 // normalize sinus to 0-1
        * (range.max - range.min);

      // TODO hardcoded translate property...
      ref.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
  });

  return ref;
};