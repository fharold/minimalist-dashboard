import {useCallback, useEffect, useState} from 'react';
import {Object3D} from 'three';
import {FSMStore} from 'webgl/stores';
import {isValidTypes} from 'webgl/hooks/useActiveObject';

export const useHandleGotoState = (object: Object3D): () => void => {
  const [gotoState, setGotoState] = useState<string | null>(null);
  const setFSMState = FSMStore(state => state.setFSMState);

  useEffect(() => {
    const {tags} = object.userData;
    if (isValidTypes(tags?.type, 'gotoState')) {
      setGotoState(tags.gotoState);
    }
  }, [object]);

  const handleGotoState = useCallback(() => {
    if (gotoState) setFSMState(gotoState);
  }, [gotoState, setFSMState]);

  return handleGotoState;
};