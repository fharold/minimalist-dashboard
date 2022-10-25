import {Object3D} from 'three/src/core/Object3D';
import {AxesHelper, BoxHelper, Color} from 'three';

export const addBoxHelperMiddleware = (obj: Object3D, color?: Color): Object3D => {
  const helper = new BoxHelper(obj, color);
  obj.add(helper);
  return obj;
}
