import create from 'zustand';
import {Object3D} from 'three/src/core/Object3D';

export type AnnotationDescriptionProps = { key: string, description: string };

type FixedAnnotationStoreProps = {
  fixedAnnotationObjects: Object3D[];
  setFixedAnnotationObjects: (fixedAnnotationObjects: Object3D[]) => void;

  fixedAnnotationDescriptions: AnnotationDescriptionProps[];
  setFixedAnnotationDescriptions: (descriptions: AnnotationDescriptionProps[]) => void;
}

export const fixedAnnotationStore = create<FixedAnnotationStoreProps>((set) => ({
  fixedAnnotationObjects: [],
  setFixedAnnotationObjects: (obj) => set({fixedAnnotationObjects: obj}),

  fixedAnnotationDescriptions: [],
  setFixedAnnotationDescriptions: (descriptions) => set({fixedAnnotationDescriptions: descriptions})
}));