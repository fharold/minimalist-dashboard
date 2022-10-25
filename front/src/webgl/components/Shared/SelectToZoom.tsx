import {useBounds} from '@react-three/drei';
import React, {useCallback, useRef} from 'react';
import {Object3D} from 'three/src/core/Object3D';

const SelectToZoom: React.FC = ({children}) => {
  const api = useBounds();
  const groupRef = useRef();

  // Returns the Object3D just under this Group
  const getAssetRoot = useCallback((obj): Object3D => {
    if (groupRef.current) {
      if (obj.parent === groupRef.current) return obj;
      return getAssetRoot(obj.parent);
    }
    return obj;
  }, []);

  // Returns the Object3D with type 'asset_pivot'
  const getAssetPivot = useCallback((obj): Object3D => {
    // if (obj.userData.tags?.type === 'asset_pivot') return obj;
    if (obj.userData.key) return obj;
    else return getAssetPivot(obj.parent);
  }, []);

  // TODO forward ref to fitScene to parent container to fitScene when new line is created  
  const fitObject = useCallback((e) => {
    e.stopPropagation();
    if (e.delta <= 2) { // do not fit when dragging
      const objTop = getAssetPivot(e.object);

      api.refresh(objTop).fit();
    }
  }, [api, getAssetPivot]);

  const fitScene = useCallback((e?) => {
    if (e?.button === 0)
      api.refresh(groupRef.current).fit();
  }, [api]);

  return (
    <group ref={groupRef} onClick={fitObject} onPointerMissed={fitScene} name={'SelectToZoom Group'}>
      {children}
    </group>
  );
};

export default SelectToZoom;