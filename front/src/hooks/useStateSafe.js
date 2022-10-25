import {useCallback, useEffect, useRef, useState} from 'react';

export function useStateSafe(initialState) {
  const _isMounted = useRef(false);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    _isMounted.current = true;
    return () => {
      _isMounted.current = false;
    };
  }, []);

  const setMountedState = useCallback((value) => {
    if (_isMounted.current)
      setState(value);
    // else
    //   console.log('prevented setState on unmounted component');
  }, []);

  return [state, setMountedState];
}