import {MutableRefObject, useCallback, useEffect, useRef, useState} from 'react';
import {Object3D} from 'three';
import {outlineStore} from 'webgl/stores';

type OutlineCallback = (isExpanded: boolean) => void


export const useAnnotationHandleOutline = (object: Object3D): OutlineCallback => {
  const [outlinable, setOutlinable] = useState<boolean>(false);
  const outlinableMeshes = useRef<MutableRefObject<Object3D>[]>([]);

  // Init outlinableMeshes
  useEffect(() => {
    const {tags} = object.userData;

    const _outlinable: boolean = tags.annotationOutlineSelected;
    setOutlinable(_outlinable);

    if (_outlinable) {
      const objArray: any[] = [];
      // @ts-expect-error => Property 'isMesh' does not exist on type 'Object3D '.
      object.traverse(obj => obj.isMesh && objArray.push({current: obj}));
      outlinableMeshes.current = objArray;
    }
  }, [object]);

  const handleOutline = useCallback((isExpanded: boolean) => {
    if (isExpanded && outlinable) {
      outlineStore.setState({selectedObjects: outlinableMeshes.current});
    } else {
      outlineStore.setState({selectedObjects: []});
    }
  }, [outlinable])

  return handleOutline;

};