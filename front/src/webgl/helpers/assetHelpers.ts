import {Object3D} from 'three';

export const getAssetRoot = (obj: Object3D | null): Object3D | null => {
  if (!obj || obj.userData.key) return obj;
  return getAssetRoot(obj.parent);
};