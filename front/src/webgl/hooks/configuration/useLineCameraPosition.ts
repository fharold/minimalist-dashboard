import {useEffect, useRef} from 'react';
import {FSMStates} from 'webgl/types/FSMStates';
import {Box3, Group, Vector3} from 'three';
import {cameraStore} from 'webgl/stores';
import {useThree} from '@react-three/fiber';
import {logHelper, tLogStyled} from 'utils/Logger';

export const useLineCameraPosition = () => {
  const {viewport: {aspect}} = useThree();
  const {activeVirtualCamera, getVirtualCameraByState} = cameraStore(state => ({
    activeVirtualCamera:  state.activeVirtualCamera,
    getVirtualCameraByState: state.getVirtualCameraByState
  }));
  const lineRef = useRef<Group>(null);

  useEffect(() => { // TODO EXTRACT TO HOOK
    const lineCamera = getVirtualCameraByState(FSMStates.line.default);

    if (lineCamera && lineCamera === activeVirtualCamera) {
      let newDistance = 12;
      let newHeight = 1.5;
      let newCenter = new Vector3();

      // TODO fit line into camera frustum
      if (lineRef.current) {
        // bounding box
        const bbox = new Box3().setFromObject(lineRef.current);
        const size = bbox.getSize(new Vector3());
        newCenter = bbox.getCenter(new Vector3());

        // common values
        const padding = -.5;
        const fovX = 2 * Math.atan( Math.tan( lineCamera.fov * Math.PI / 180 / 2 ) * aspect ) * 180 / Math.PI; // hFOV in degrees
        const fovY = lineCamera.fov; // vFOV

        // RECTANGLE
        let width = Math.max(size.x, size.z) + padding;
        let height = size.y + padding;
        newHeight = size.y;

        const distanceX = (width / 2) / Math.tan(Math.PI * fovX / 360) + (width / 2);
        const distanceY = (height / 2) / Math.tan(Math.PI * fovY / 360) + (width / 2);

        newDistance = Math.max(distanceX, distanceY);
      }

      lineCamera.position.set(0, newHeight, newDistance);
      lineCamera.userData.tags.cameraTarget.position.copy(newCenter);
      lineCamera.lookAt(newCenter);
      tLogStyled('[useLineCameraPosition] Setting LineCamera position', logHelper.debug, lineCamera.position);
    }
  }, [activeVirtualCamera, aspect, getVirtualCameraByState]);

  return {lineRef};
};
