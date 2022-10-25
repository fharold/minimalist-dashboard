import * as React from 'react';
import {AnimationAction, AnimationClip, AnimationMixer, Object3D} from 'three';
import {useFrame} from '@react-three/fiber';

declare type Api<T extends AnimationClip> = {
  ref: React.MutableRefObject<Object3D | undefined | null>;
  clips: AnimationClip[];
  mixer: AnimationMixer;
  names: T['name'][];
  actions: {
    [key in T['name']]: AnimationAction | null;
  };
};

// TODO adapt the accept animation arrays from multiple GLTFs

const useAnimationsArray = (clips: AnimationClip[], root?: React.MutableRefObject<Object3D | undefined | null> | Object3D): Api<AnimationClip> => {
  const ref = React.useRef();
  const [actualRef] = React.useState(() => root ? root instanceof Object3D ? {
    current: root
  } : root : ref);

  // @ts-expect-error 'undefined' is not assignable to parameter of type 'Object3D  | AnimationObjectGroup'.
  const [mixer] = React.useState(() => new AnimationMixer(undefined));
  const lazyActions = React.useRef<{ [K in string]: AnimationAction }>({});
  const [api] = React.useState(() => {
    const actions = {};
    clips.forEach(clip => Object.defineProperty(actions, clip.name, {
      enumerable: true,

      get() {
        if (actualRef.current) {
          return lazyActions.current[clip.name] || (lazyActions.current[clip.name] = mixer.clipAction(clip, actualRef.current));
        }
      }

    }));
    return {
      ref: actualRef,
      clips,
      actions,
      names: clips.map(c => c.name),
      mixer
    };
  });
  useFrame((state, delta) => mixer.update(delta));
  React.useEffect(() => {
    const currentRoot = actualRef.current;
    return () => {
      // Clean up only when clips change, wipe out lazy actions and uncache clips
      lazyActions.current = {};
      Object.values(api.actions).forEach(action => {
        if (currentRoot) {
          mixer.uncacheAction(action as AnimationClip, currentRoot);
        }
      });
    };
  }, [clips]);
  return api;
};

export {useAnimationsArray};
