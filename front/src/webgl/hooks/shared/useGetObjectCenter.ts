import {Box3, Object3D, Vector3} from 'three';
import {useEffect, useState} from 'react';

export const useGetObjectCenter = (object: Object3D): Vector3 => {
  const [position, setPosition] = useState<Vector3>(new Vector3(0, 0, 0));

  useEffect(() => {
    // @ts-ignore
    if (object.isMesh) { // get bounding box center
      const boundingBox = new Box3();
      boundingBox.setFromObject(object);
      setPosition(boundingBox.getCenter(new Vector3()));
    } else { // get pivot position
      setPosition(object.getWorldPosition(new Vector3()));
    }

  }, [object]);

  return position;
}