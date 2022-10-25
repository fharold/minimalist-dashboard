// import {CameraOffset} from 'webgl/types/CameraOffset';
// import {sizeClassStore} from 'stores/sizeClassStore';

// const _portrait = window.screen.height > window.screen.width;

// const _screensaverCameraOffsetPortrait = new CameraOffset({x: 0, y: 300, zoomFactor: 1.25});
// const _demoCameraOffsetPortrait = new CameraOffset({x: 0, y: 200, zoomFactor: 1});
// const _overlayCameraOffsetPortrait = new CameraOffset({x: 0, y: 425, zoomFactor: .66});
// const _screensaverCameraOffsetLandscape = new CameraOffset({x: 0, y: 100, zoomFactor: 1.25});
// const _demoCameraOffsetLandscape = new CameraOffset({x: 350, y: 50, zoomFactor: 1});
// const _overlayCameraOffsetLandscape = new CameraOffset({x: 350, y: 300, zoomFactor: .75});

export const DefaultValues = {

  renderPauseDelay: 10_000, // delay in ms, 0=never, 5*60e3

  // Camera Controls
  lerpDuration: 0,
  orbitControlsEnabled: false,
  enableDamping: true,

  enableRotate: false,
  enablePan: false, // TODO PROD = false
  enableZoom: false,

  groundThreshold: null, // default null = no effect

  autoRotate: false, // TODO CHANGE TO FALSE
  autoRotateSpeed: -.66,

  // screensaverCameraOffset: _portrait ?? true ? _screensaverCameraOffsetPortrait : _screensaverCameraOffsetLandscape,
  // demoCameraOffset: _portrait ?? true ? _demoCameraOffsetPortrait : _demoCameraOffsetLandscape,
  // overlayCameraOffset: _portrait ?? true ? _overlayCameraOffsetPortrait : _overlayCameraOffsetLandscape,
};

// pseudo responsivity...
// sizeClassStore.subscribe(
//   state => state.portrait,
//   (value) => {
//     DefaultValues.screensaverCameraOffset = value ?? true ? _screensaverCameraOffsetPortrait : _screensaverCameraOffsetLandscape;
//     DefaultValues.demoCameraOffset = value ?? true ? _demoCameraOffsetPortrait : _demoCameraOffsetLandscape;
//     DefaultValues.overlayCameraOffset = value ?? true ? _overlayCameraOffsetPortrait : _overlayCameraOffsetLandscape;
//   },
//   {fireImmediately: true}
// );