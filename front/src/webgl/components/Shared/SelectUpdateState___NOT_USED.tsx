import React, {useCallback, useRef} from 'react';
import {FSMStore} from 'webgl/stores';
import {FSMStates} from 'webgl/types/FSMStates';
import {getAssetRoot} from 'webgl/helpers/assetHelpers';

const SelectUpdateState___NOT_USED: React.FC = ({children}) => {
  const groupRef = useRef();
  const setFSMState = FSMStore(state => state.setFSMState);

  const gotoAssetState = useCallback((e) => {
    // e.stopPropagation();
    // if (e.delta <= 2) { // do not goto state when dragging
    //   const objTop = getAssetRoot(e.object);
    //   setFSMState(FSMStates.line[objTop?.userData.key]);
    // }
  }, [setFSMState]);

  const returnToLineState = useCallback((e?) => {
    // if (e?.button === 0)
    //   setFSMState(FSMStates.line.default);
  }, [setFSMState]);

  return (
    <group ref={groupRef} onClick={gotoAssetState} onPointerMissed={returnToLineState} name={'SelectUpdateState___NOT_USED Group'}>
      {children}
    </group>
  );
};

export default SelectUpdateState___NOT_USED;