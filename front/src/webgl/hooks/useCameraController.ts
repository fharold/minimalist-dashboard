import {cameraStore, controlsStore, FSMStore} from 'webgl/stores';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useFrame} from '@react-three/fiber';
import {easeOutCubic} from 'utils/Easings';
import {MathUtils, PerspectiveCamera, Quaternion, Vector3} from 'three';
import {sizeClassStore} from 'stores';
import {DefaultValues} from 'webgl/types/DefaultValues';
import {logHelper, tLogStyled} from 'utils/Logger';

const _tmpV3 = new Vector3();
const _tmpQuat = new Quaternion();

// TODO EXTRACT TO HELPER
const valueOrDefault = (value: any, defaultValue: any): any => {
  if (value === undefined) {
    return defaultValue;
  } else {
    return value;
  }
};

export const useCameraController = (): void => {
  const fovMultiplier = sizeClassStore(state => state.fovMultiplier);
  const currentFSMState = FSMStore(state => state.currentFSMState);
  const {cameraBrain, activeVirtualCamera, setActiveVirtualCamera, rawFov, setRawFov} = cameraStore(state => ({
    cameraBrain: state.cameraBrain,
    rawFov: state.rawFov,
    setRawFov: state.setRawFov,
    activeVirtualCamera: state.activeVirtualCamera,
    setActiveVirtualCamera: state.setActiveVirtualCamera
  }));
  const {setControlsStoreConfig, setControlsTarget} = controlsStore(state => ({
    setControlsStoreConfig: state.setConfig,
    setControlsTarget: state.setTarget
  }));

  //#region Lerping between Cameras

  const [isLerping, setLerping] = useState<boolean>(false);
  const lerpDuration = useRef<number>(-1);
  const lerpTime = useRef<number>(-1);
  const orbitControlsEnabled = useRef<boolean>(false);
  const enableRotate = useRef<boolean>(false);
  const autoRotate = useRef<boolean>(false);
  const enablePan = useRef<boolean>(false);
  const enableZoom = useRef<boolean>(false);
  const groundThreshold = useRef<number | null>(null);
  const previousCamera = useRef<PerspectiveCamera>(new PerspectiveCamera());
  // const currentCamera = useRef<PerspectiveCamera>(new PerspectiveCamera());
  const nextTargetPosition = useRef<Vector3>(new Vector3());

  const prepareForLerping =
    useCallback(() => {
      if (!cameraBrain || !activeVirtualCamera) return;

      lerpDuration.current = valueOrDefault(activeVirtualCamera.userData.tags?.lerpDuration, DefaultValues.lerpDuration);
      orbitControlsEnabled.current = valueOrDefault(activeVirtualCamera.userData.tags?.orbitControls, DefaultValues.orbitControlsEnabled);
      enableRotate.current = valueOrDefault(activeVirtualCamera.userData.tags?.enableRotate, DefaultValues.enableRotate);
      autoRotate.current = valueOrDefault(activeVirtualCamera.userData.tags?.autoRotate, DefaultValues.autoRotate);
      enablePan.current = valueOrDefault(activeVirtualCamera.userData.tags?.enablePan, DefaultValues.enablePan);
      enableZoom.current = valueOrDefault(activeVirtualCamera.userData.tags?.enableZoom, DefaultValues.enableZoom);
      groundThreshold.current = valueOrDefault(activeVirtualCamera.userData.tags?.groundThreshold, DefaultValues.groundThreshold);
      nextTargetPosition.current = valueOrDefault(activeVirtualCamera.userData.tags?.cameraTarget?.getWorldPosition(new Vector3()), null); // cameraTarget is Object3D

      previousCamera.current = cameraBrain.clone(); // keep track of previous cam for lerping

      setControlsStoreConfig({enabled: false, enableDamping: false});
      tLogStyled(`[useCameraController] Camera lerping to ${activeVirtualCamera?.name} in ${lerpDuration.current}s`, logHelper.processing); // DEBUG
      setLerping(true);
      lerpTime.current = 0;

    }, [activeVirtualCamera, cameraBrain, setControlsStoreConfig]);

  const lerpCameraTransform =
    useCallback((target: PerspectiveCamera, from: PerspectiveCamera, to: PerspectiveCamera, t: number) => {
      // target.position.lerpVectors(from.position, to.position, t);
      target.position.lerpVectors(from.position, to.getWorldPosition(_tmpV3), t);
      target.quaternion.slerpQuaternions(from.quaternion, to.getWorldQuaternion(_tmpQuat), t); // overriden by target
      target.scale.lerpVectors(from.scale, to.getWorldScale(_tmpV3), t);
      setRawFov(to.fov);
      target.fov = MathUtils.lerp(from.fov, to.fov * fovMultiplier, t);

      // tLogStyled(`[useCameraController] Lerping ${t*100}%`, logHelper.processing, from.position, target.position, to.getWorldPosition(_tmpV3)); // TODO DEBUG

      setControlsTarget(calculateTarget(target)); // target 0.01 m in front of the camera
    }, [fovMultiplier, setControlsTarget, setRawFov]);

  const copyCameraTransform =
    useCallback((target: PerspectiveCamera, source: PerspectiveCamera) => {
      // position
      target.position.copy(source.getWorldPosition(_tmpV3));

      // rotation
      const cameraTarget = source.userData.tags?.cameraTarget;
      // if (cameraTarget) target.lookAt(cameraTarget.position);
      if (cameraTarget) target.lookAt(cameraTarget.getWorldPosition(_tmpV3)); // TODO TEST
      else target.quaternion.copy(source.getWorldQuaternion(_tmpQuat).clone());
      console.log(cameraTarget);

      // scale
      target.scale.copy(source.getWorldScale(_tmpV3));
      setRawFov(source.fov);
      target.fov = source.fov * fovMultiplier;

    }, [fovMultiplier, setRawFov]);

  // FOV
  useEffect(() => {
    if (cameraBrain) cameraBrain.fov = rawFov * fovMultiplier;
  }, [cameraBrain, fovMultiplier, rawFov]);

  useFrame((state, delta) => {
    if (cameraBrain && activeVirtualCamera) {
      if (isLerping) {
        let finishedLerping = !isLerping;

        lerpTime.current += delta; //increment timer once per frame

        // lerping finished
        if (lerpTime.current >= lerpDuration.current) {
          lerpTime.current = lerpDuration.current;
          finishedLerping = true;
        }

        // move camera
        const t = lerpDuration.current === 0 ? 1 : easeOutCubic(lerpTime.current / lerpDuration.current);
        lerpCameraTransform(cameraBrain, previousCamera.current, activeVirtualCamera, t);

        // set target and re-enable controls when finished
        if (finishedLerping) {
          setLerping(false);

          setControlsTarget(nextTargetPosition.current ? nextTargetPosition.current : calculateTarget(activeVirtualCamera));

          setControlsStoreConfig({
            enabled: orbitControlsEnabled.current || DefaultValues.orbitControlsEnabled,
            enableDamping: orbitControlsEnabled.current || DefaultValues.enableDamping, // damping if controls enabled??
            enableRotate: enableRotate.current || DefaultValues.enableRotate,
            enablePan: enablePan.current || DefaultValues.enablePan,
            enableZoom: enableZoom.current || DefaultValues.enableZoom,
            autoRotate: autoRotate.current || DefaultValues.autoRotate,
            groundThreshold: groundThreshold.current || DefaultValues.groundThreshold,
            autoRotateSpeed: DefaultValues.autoRotateSpeed
          });
        }
      } else {
        if (!orbitControlsEnabled.current)
          copyCameraTransform(cameraBrain, activeVirtualCamera);
      }

      cameraBrain.updateProjectionMatrix();
    }
  });

  //#endregion

  // Set isLerping to true to
  useEffect(() => {
    prepareForLerping();
  }, [activeVirtualCamera, prepareForLerping]);

  // Update activeVirtualCamera when FSMState changes
  useEffect(() => {
    setActiveVirtualCamera(currentFSMState);
  }, [currentFSMState, setActiveVirtualCamera]);

};

/*** @returns {Vector3} */
const calculateTarget = (camera: PerspectiveCamera, distance = 0.01): Vector3 =>
  (new Vector3()).addVectors(
    camera.getWorldPosition(_tmpV3),
    camera.getWorldDirection(new Vector3()).multiplyScalar(distance)
  );
