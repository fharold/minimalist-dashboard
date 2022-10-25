import {logHelper, tLogStyled} from 'utils/Logger';
import {AnnotationDescriptionProps} from 'webgl/stores/annotations/fixedAnnotationStore';
import {Object3D} from 'three/src/core/Object3D';

// TODO FAKE DATE


const descriptions_FAKE: Array<AnnotationDescriptionProps> = [
  {key: 'ID_001', description: 'Ensemble de pièces ou d\'organes liés entre eux'},
  {key: 'ID_002', description: 'dont l\'un au moins est mobile'},
  {
    key: 'ID_003',
    description: 'équipé ou destiné à être équipé d\'un système d\'entraînement autre que la force humaine employée directement'
  },
  {key: 'ID_004', description: 'réunis en vue d\'une application définie'},
  {key: 'annotationId4', description: 'annotationId4 description sdfsdfgsdfg sdfg sdfg sdfg sfdg sdfg sdfg '},
  {key: '', description: '6eme description'},
  {key: '', description: '7eme description'},
  {key: '', description: 'dernière description'}
];

export const getAnnotationDescriptions__FAKE = async (annotationObjects: Object3D[]): Promise<AnnotationDescriptionProps[]> => {
  const descriptions = descriptions_FAKE.filter(description =>
    annotationObjects.some(obj =>
      obj.userData.tags?.annotationId === description.key));

  tLogStyled('[getAnnotationDescriptions__FAKE()] using fake data : fixed annotation descriptions', logHelper.warning, descriptions);

  return new Promise<AnnotationDescriptionProps[]>((resolve) => {
    setTimeout(() => resolve(descriptions), 1000);
  });
};