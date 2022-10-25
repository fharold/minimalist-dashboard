import {useEffect} from 'react';
import {useMeasure} from 'react-use';
import {sizeClassStore} from 'stores';
import {UseMeasureRef} from 'react-use/lib/useMeasure';

/**
 * Determines a Class name (`desktop`, `tablet`, `mobile`) to use wit various HTMLElement.
 * @returns appRef reference to use with app div container
 */
const useSizeClass = (): UseMeasureRef<HTMLDivElement> => {
  const [appRef, {width, height}] = useMeasure<HTMLDivElement>();

  const setSizeClass = sizeClassStore(state => state.setSizeClass);

  // Define size className
  useEffect(() => {
    if (width) setSizeClass(width, height);
  }, [height, setSizeClass, width]);

  return appRef;
};

export {useSizeClass};