import {Object3D} from 'three';
import {logHelper, tLogStyled} from 'utils/Logger';

export const getObjectByType_NOT_USED = (type: string, root: Object3D): Object3D | undefined => {
  tLogStyled('Prefer using getObjectByType given by AssetEntity', logHelper.warning);
  return getObjectsByType_NOT_USED(type, root, 1)[0] || undefined;
};

export const getObjectsByType_NOT_USED = (type: string, root: Object3D, limit = Infinity): Object3D[] => {
  let foundObjects: Object3D[] = [];
  let foundCounter: number = 0;

  tLogStyled('Prefer using getObjectsByType given by AssetEntity', logHelper.warning);

  root.traverse(obj => {
    if (obj.userData.tags?.type === type && foundCounter < limit) {
      foundObjects.push(obj);
      foundCounter++;
    }
  });

  return foundObjects;
}