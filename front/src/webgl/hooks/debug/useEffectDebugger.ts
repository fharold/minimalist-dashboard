import {useEffect, useRef} from 'react';
import {logHelper, tLogStyled} from 'utils/Logger';

// @ts-ignore
const usePrevious = (value, initialValue) => {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// @ts-ignore
export const useEffectDebugger = (effectHook, dependencies, dependencyNames: string[] = [], effectName: string = '') => {
  const previousDeps = usePrevious(dependencies, []);

  // @ts-ignore
  const changedDeps = dependencies.reduce((accum, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index;
      return {
        ...accum,
        [keyName]: {
          before: previousDeps[index],
          after: dependency
        }
      };
    }

    return accum;
  }, {});

  if (Object.keys(changedDeps).length) {
    tLogStyled('[use-effect-debugger] ' + effectName, logHelper.debug, changedDeps);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effectHook, dependencies);
};