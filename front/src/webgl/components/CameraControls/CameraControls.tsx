import React, {useCallback, useEffect, useRef} from 'react';
import {OrbitControls, TrackballControls} from '@react-three/drei';
import {
  CameraControls as CameraControlsImpl,
  OrbitControlsExp as OrbitControlsImpl,
  TrackballControlsExp as TrackballControlsImpl
} from 'three-stdlib';
import {useFrame, useThree} from '@react-three/fiber';
import {cameraStore, ControlsProps, controlsStore} from 'webgl/stores';
import {PerspectiveCamera, Vector3} from 'three';

const cloneControlsTarget = (from: CameraControlsImpl, to: CameraControlsImpl) => {
  if (!from || !to) return;
  const target = from.target;
  //@ts-expect-error update() is private
  from.update();
  to.target.set(target.x, target.y, target.z);
  // @ts-expect-error update() is private
  to.update();
};

const CameraControls: React.FC = () => {
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);
  const trackballControlsRef = useRef<TrackballControlsImpl>(null);
  const groundThreshold = useRef<number | null>(null);

  //#region Init CameraBrain

  const setCameraBrain = cameraStore(state => state.setCameraBrain);
  const camera = useThree(state => state.camera);
  useEffect(() => {
    // Camera Brain
    camera.name = 'Camera Brain';
    camera.far = 250;
    camera.near = 0.01;
    console.log(camera.position);
    camera.position.set(0, 1.5, 5);
    setCameraBrain(camera as PerspectiveCamera); // r3f default camera
  }, [camera, setCameraBrain]);

  //#endregion

  //#region Init ControlsStore functions

  useEffect(() => {

    const getTarget = () => {
      return orbitControlsRef.current?.target || new Vector3();
    };

    const setTarget = (pos: Vector3) => {
      if (orbitControlsRef.current)
        orbitControlsRef.current.target.set(pos.x, pos.y, pos.z);
    };

    // Init function in controlsStore
    const saveState = () => {
      orbitControlsRef.current?.saveState();
      // trackballControlsRef.current?.saveState();
    };

    const update = () => {
      // @ts-expect-error update is private
      orbitControlsRef.current?.update();
      // @ts-expect-error update is private
      trackballControlsRef.current?.update();
    };

    const reset = () => {
      orbitControlsRef.current?.reset();
      trackballControlsRef.current?.reset();
    };

    controlsStore.setState({
      getTarget: getTarget,
      setTarget: setTarget,
      saveState: saveState,
      update: update,
      reset: reset
    });

  }, []);

  //#endregion

  //#region Update Controls Config

  const updateControls = useCallback((config: ControlsProps) => {
    // setConfigState(config);

    const orbit = orbitControlsRef.current || {} as CameraControlsImpl;
    const trackball = trackballControlsRef.current || {} as CameraControlsImpl;

    orbit.enabled = config.enabled;
    trackball.enabled = config.enabled;

    orbit.enableDamping = config.enableDamping;
    // @ts-expect-error staticMoving doesn't exist on CameraControls
    trackball.staticMoving = !config.enableDamping;

    orbit.enablePan = config.enablePan;
    orbit.enableRotate = config.enableRotate;
    orbit.autoRotate = config.autoRotate;
    orbit.autoRotateSpeed = config.autoRotateSpeed;
    // @ts-ignore
    trackball.noZoom = !config.enableZoom;

    groundThreshold.current = config.groundThreshold;

  }, []);

  /* Subscribe to Controls config updates */
  useEffect(() => {
    // using transient updates because changes occur too fast to be taken into account
    const controlsSubscription = controlsStore.subscribe(
      state => state.config,
      (config: ControlsProps) => updateControls(config)
    );

    return () => controlsSubscription(); // cancel subscription
  }, [updateControls]);

  //#endregion

  //#region Executed each frame

  //Clone OrbitControls target to TrackballControls
  useFrame(() => {
    // @ts-ignore
    cloneControlsTarget(orbitControlsRef.current, trackballControlsRef.current);
  });

  // Prevent camera from going below ground
  useEffect(() => {
    orbitControlsRef.current?.addEventListener('change', () => {
      if (groundThreshold.current &&
        orbitControlsRef.current &&
        orbitControlsRef.current.object.position.y < groundThreshold.current) {

        orbitControlsRef.current.object.position.y = groundThreshold.current;
      }
    });
  }, []);

  //#endregion

  return (
    <>
      {/*@ts-ignore*/}
      <OrbitControls ref={orbitControlsRef}
        enablePan={true}
        enableRotate={true}
        enableZoom={false}
        enabled={false}
        enableDamping={false}
        makeDefault={true}
      />
      {/*@ts-ignore*/}
      <TrackballControls ref={trackballControlsRef}
        noPan={true}
        noRotate={true}
        noZoom={false}
        enabled={false}
        staticMoving={true}
        zoomSpeed={.2} // default 1.2
        // minDistance={.5} // TODO: adapt depending on target dimensions
        maxDistance={20} // TODO: adapt depending on target dimensions
        dynamicDampingFactor={0.1} // default 0.2
      />
      {/*@ts-ignore*/}
      {/*<CameraShake yawFrequency={0.05} rollFrequency={0.2} pitchFrequency={0.1} />*/}
    </>
  );
};

export default CameraControls;
