import {useEffect, useState} from 'react';
import {Object3D} from 'three';
import {FSMStore} from 'webgl/stores';

export const isValidTypes = (objectType: string, comparedType: string): boolean => {
  const types = objectType.split('&') || [];
  return types.includes(comparedType);
};

export const isAnnotationActive = (object: Object3D, currentFSMState?: string): boolean => {

  const activeStates: string[] = object.userData.tags?.annotationActiveStates?.split('&') || [];
  const invertStates: boolean = object.userData.tags?.annotationInvertStates;
  const isActive = activeStates.some(activeState => activeState === currentFSMState);
  return invertStates ? !isActive : isActive;

};

export const isObjectActive = (object?: Object3D, currentFSMState?: string): boolean => {
  if (!object) return false;
  const activeStates: string[] = object.userData.tags?.activeStates?.split('&') || [];
  const invertStates: boolean = object.userData.tags?.invertStates;
  const isActive = activeStates.some(activeState => activeState === currentFSMState);
  return invertStates ? !isActive : isActive;

};

export const useAnnotationActiveState = (objects: Object3D[]): Object3D[] => {
  const currentFSMState = FSMStore(state => state.currentFSMState);
  const [activeObjects, setActiveObjects] = useState<Object3D[]>([]);

  useEffect(() => {
    if (objects?.length > 0) {
      const _activeObjects = objects.filter(obj => isAnnotationActive(obj, currentFSMState));
      setActiveObjects(_activeObjects);
    }
  }, [objects, currentFSMState]);

  return activeObjects;
};

export const useActiveObject = (object?: Object3D): Object3D | undefined => {
  const currentFSMState = FSMStore(state => state.currentFSMState);
  // eslint-disable-next-line no-mixed-operators
  return isObjectActive(object, currentFSMState) && object || undefined;
};

export const useActiveObjects = (objects: Object3D[]): Object3D[] => {
  const currentFSMState = FSMStore(state => state.currentFSMState);
  const [activeObjects, setActiveObjects] = useState<Object3D[]>([]);

  useEffect(() => {
    if (objects?.length > 0) {
      const _activeObjects = objects.filter(obj => isObjectActive(obj, currentFSMState));
      setActiveObjects(_activeObjects);
    }
  }, [objects, currentFSMState]);

  return activeObjects;
};
