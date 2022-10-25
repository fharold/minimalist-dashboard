import {Object3D} from 'three/src/core/Object3D';
import {AxesHelper} from 'three';

export const addAxesHelperMiddleware = (obj: Object3D, size?: number): Object3D => {
  const axesHelper = new AxesHelper(size);
  obj.add(axesHelper);
  return obj;
}
