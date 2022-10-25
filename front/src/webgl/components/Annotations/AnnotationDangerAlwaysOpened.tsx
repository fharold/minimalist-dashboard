import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Object3D} from 'three';
import {Html} from '@react-three/drei/web/Html';
import {sizeClassStore} from 'stores';
import {
  useAnnotationForcedAngle,
  useAnnotationHandleOutline,
  useAnnotationPositioning,
  useGetObjectCenter,
  useHandleGotoState
} from 'webgl/hooks';

import './AnnotationBase.scss';
import './AnnotationDangerAlwaysOpened.scss';

type AnnotationProps = {
  object: Object3D
}

const AnnotationDangerAlwaysOpened: React.FC<AnnotationProps> = ({object}: AnnotationProps) => {
  const sizeClass = sizeClassStore(state => state.sizeClass);

  const [markerChar, setMarkerChar] = useState<string>('!'); // TODO retrieve from backend
  const [markerTooltip, setTooltip] = useState<string>('<img src="https://via.placeholder.com/188"/>'); // TODO retrieve from backend

  const isPointerDown = useRef<boolean>(false);
  const [isHovered, setHovered] = useState<boolean>(false);

  const [distanceMultiplier] = useState<number | undefined>(0);

  const position = useGetObjectCenter(object);
  const annotationAngle = useAnnotationForcedAngle(object.userData.tags?.annotationForcePosition);
  const handleGotoState = useHandleGotoState(object);
  const handleOutline = useAnnotationHandleOutline(object); // TODO maybe outline object when hovering? => todo later
  const [annotationRef, , overrideCalculatePosition] = useAnnotationPositioning(...annotationAngle, distanceMultiplier, true);

  const onPointerEnter = useCallback(() => setHovered(true), []);
  const onPointerLeave = useCallback(() => setHovered(false), []);
  const onPointerDown = useCallback(() => isPointerDown.current = true, []);
  const onPointerUp = useCallback(() => {
    if (!isPointerDown.current) return;
    handleGotoState();
    isPointerDown.current = false;
  }, [handleGotoState]);

  useEffect(() => {
    handleOutline(isHovered);
  }, [handleOutline, isHovered]);

  return (
    <Html
      zIndexRange={isHovered ? [502, 501] : [500, 100]} // need component to update when changing zIndexRange
      style={{pointerEvents: 'none'}}
      position={[position.x, position.y, position.z]}
      calculatePosition={overrideCalculatePosition}
      name={'AnnotationDangerAlwaysOpened Html'}
    >
      <div className="annotation-container">

        <svg className={`annotation-circle dangerAlwaysOpened ${sizeClass} `}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        >
          <circle id="backCircle"/>
          <circle id="frontCircle"/>
          <text x="50%" y="50%" dy=".3em">{markerChar}</text>
        </svg>

        <div ref={annotationRef}
          className={`annotation dangerAlwaysOpened ${sizeClass} visible`}>
          <div className={`annotation-tooltip ${sizeClass}`} dangerouslySetInnerHTML={{ __html: markerTooltip }}/> {/*TODO keep using dangerouslySetInnerHTML ? */}
        </div>

      </div>
    </Html>
  );
};

export default AnnotationDangerAlwaysOpened;
