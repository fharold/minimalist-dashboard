import create from 'zustand';
import {Box3, Vector3} from 'three';

type LineStoreState = {
  bounds: Box3;
  center: Vector3;
  size: Vector3;
  setBounds: (box: Box3) => Box3;
};

const lineStore = create<LineStoreState>((set) => ({
  bounds: new Box3(),
  center: new Vector3(),
  size: new Vector3(),
  setBounds: (box) => {
    set({
      bounds: box,
      center: box.getCenter(new Vector3()),
      size: box.getSize(new Vector3())
    });
    return box;
  }
}));

export {lineStore};