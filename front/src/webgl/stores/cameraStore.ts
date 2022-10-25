import create from 'zustand';
import {PerspectiveCamera} from 'three';
import {logHelper, tLogStyled} from 'utils/Logger';

type CameraStoreProps = {
  cameraBrain: PerspectiveCamera | null;
  setCameraBrain: (cam: PerspectiveCamera) => void;

  rawFov: number;
  setRawFov: (fov: number) => void;

  virtualCameras: PerspectiveCamera[] | [];
  setVirtualCameras: (cams: PerspectiveCamera[]) => void;
  resetVirtualCameras: () => void;
  getVirtualCameraByState: (state?: string) => PerspectiveCamera | null;
  activeVirtualCamera: PerspectiveCamera | null;
  setActiveVirtualCamera: (state?: string) => void;

  // Offset

  // previousCameraOffset: CameraOffset;
  // setPreviousCameraOffset: (offset: CameraOffset) => void;
  //
  // targetCameraOffset: CameraOffset;
  // setTargetCameraOffset: (offset: CameraOffset, duration?: number, delay?: number) => void;
  //
  // cameraOffsetTransition: { delay: number, duration: number };
  // resetCameraOffset: () => void;
};

export const cameraStore = create<CameraStoreProps>((set, get) => ({
  cameraBrain: null,
  setCameraBrain: (cam) => set({cameraBrain: cam}),

  rawFov: 10,
  setRawFov: (fov) => set({rawFov: fov}),

  virtualCameras: [],
  setVirtualCameras: (cams) => set({virtualCameras: cams}),
  resetVirtualCameras: () => set({virtualCameras: []}),
  getVirtualCameraByState: (state) => {
    return get().virtualCameras.find(camera => {
      const activeStates: string[] = camera.userData.tags?.activeStates?.split('&');
      const invertStates: boolean = camera.userData.tags?.invertStates;
      const isActive =
        activeStates?.some(activeState => activeState === state) ||
        activeStates?.some(activeState => activeState === state?.split('.').slice(0, -1).join('.'));
      // TODO add priority ??
      return invertStates ? !isActive : isActive;
    }) || null;
  },
  // virtualCameraTargets: [],
  // setVirtualCameraTargets: (targets) => set({virtualCameraTargets: targets}),
  activeVirtualCamera: null,
  setActiveVirtualCamera: (state) => {
    const activeVirtualCamera = get().getVirtualCameraByState(state);
    tLogStyled(`[CameraStore] activeVirtualCamera ${activeVirtualCamera?.name || 'NONE'}`, logHelper.processing, activeVirtualCamera, state); // DEBUG
    if (get().activeVirtualCamera === activeVirtualCamera) return;
    set({activeVirtualCamera: activeVirtualCamera});
  },

  // previousCameraOffset: DefaultValues.screensaverCameraOffset,
  // setPreviousCameraOffset: (offset) => {
  //   set({previousCameraOffset: offset});
  // },
  //
  // targetCameraOffset: DefaultValues.screensaverCameraOffset,
  // setTargetCameraOffset: (offset, duration, delay) => {
  //   set({targetCameraOffset: offset});
  //   set({cameraOffsetTransition: {delay: delay || 0, duration: duration || 0}})
  // },
  // cameraOffsetTransition: {delay: 0, duration: 0},
  // resetCameraOffset: () => set({
  //   targetCameraOffset: DefaultValues.demoCameraOffset
  // }),
}));
