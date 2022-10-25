import {EquipmentEntity} from 'webgl/entities/EquipmentEntity';
import {useEffect} from 'react';
import {logHelper, tLogStyled} from 'utils/Logger';
import {cameraStore, configurationStore} from 'webgl/stores';
import {Object3D, PerspectiveCamera} from 'three';

export const useUpdateLineVirtualCameras = (equipmentEntities?: EquipmentEntity[]): void => {
  const {setVirtualCameras} = cameraStore(state => ({
    setVirtualCameras: state.setVirtualCameras
  }));
  const setConfigurationReadiness = configurationStore(state => state.setConfiguration3dReadiness);

  useEffect(() => {
    // Virtual Cameras
    const vCams: PerspectiveCamera[] = [];
    if (equipmentEntities) {
      equipmentEntities?.forEach(equip => {
        // const _cams = equip.cameras.filter(cam => cam.userData.tags?.type === 'camera_virtual') as PerspectiveCamera[];
        const _cams: PerspectiveCamera[] = [];
        equip.scene.traverse(obj => {
          if (/*obj.isPerspectiveCamera &&*/ obj.userData.tags?.type === 'camera_virtual') {
            _cams.push(obj as PerspectiveCamera);
          }
        });
        setCameraTargets(_cams, equip.scene);
        vCams.push(..._cams);
      });
    }

    const lineCamera = new PerspectiveCamera(50);
    const lineCameraTarget = new Object3D();
    lineCamera.name = 'LINE CAMERA';
    lineCamera.fov = 50;
    lineCamera.userData = {
      name: lineCamera.name,
      tags: {
        type: 'camera_virtual',
        activeStates: 'line.default',
        cameraTarget: lineCameraTarget, // center
        orbitControls: true,
        enableRotate: true,
        enablePan: true,
        enableZoom: true,
        groundThreshold: '0.05',
        lerpDuration: '1'
      }
    }; // TODO hard coded, find a better alternative
    lineCamera.lookAt(lineCameraTarget.position);
    vCams.push(lineCamera);
    tLogStyled('[useUpdateLineVirtualCameras] lineCamera', logHelper.debug, lineCamera);

    setVirtualCameras(vCams);
    tLogStyled('[useUpdateLineVirtualCameras] Processing virtual cameras', logHelper.subdued, vCams);

    setConfigurationReadiness(true);

  }, [equipmentEntities, setConfigurationReadiness, setVirtualCameras]);
};

const setCameraTargets = (cameras: Object3D[], scene: Object3D): Object3D[] => {
  // If cameraTarget is set find this object by name
  // If not set then try to find object with the name Camera.name + "Target"

  // TODO PROBLEM when loading GLTF, sometimes Cameras are renamed with unique names (CameraName => CameraName_1)
  //  but Targets are not renamed! ==> USING `userData.name` instead of `obj.name`
  cameras.forEach(cam => {
    const targetName = [cam.userData.tags?.cameraTarget, cam.userData.name + '.Target'];
    scene.traverse(obj => {
      if (targetName.includes(obj.userData.name)) {
        cam.userData.tags.cameraTarget = obj; // replace target name by its object
      }
    });

  });

  return cameras;
};