import create from 'zustand';
import {Object3D} from 'three/src/core/Object3D';
import {MutableRefObject} from 'react';

declare type ObjectRef = MutableRefObject<Object3D>;
// declare type ObjectRef = Object3D;

export type OutlineStoreProps = {
  selectedObjects: ObjectRef[];
  // outlineSelection: any;
}

export const outlineStore = create<OutlineStoreProps>((set) => ({
  selectedObjects: [],
  // outlineSelection: null
}));