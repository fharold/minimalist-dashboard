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
import './AnnotationOrangeHover.scss';

type AnnotationProps = {
  object: Object3D
}

const AnnotationOrangeHover: React.FC<AnnotationProps> = ({object}: AnnotationProps) => {
  const sizeClass = sizeClassStore(state => state.sizeClass);

  const isPointerDown = useRef<boolean>(false);
  const [markerTitle, setTitle] = useState<string>('Contact'); // TODO retrieve from backend
  const [isHovered, setHovered] = useState<boolean>(false);

  const [distanceMultiplier] = useState<number | undefined>(object.userData.tags?.annotationDistanceMultiplier || 0.8); // "top" instead of null by default

  const position = useGetObjectCenter(object);
  const annotationAngle = useAnnotationForcedAngle(object.userData.tags?.annotationForcePosition);
  const handleGotoState = useHandleGotoState(object);
  const handleOutline = useAnnotationHandleOutline(object);
  const [annotationRef, , overrideCalculatePosition] = useAnnotationPositioning(...annotationAngle, distanceMultiplier);

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
      name={'AnnotationOrangeHover Html'}
    >
      <div className="annotation-container">

        <svg className={`annotation-circle orangeHover ${sizeClass} `}
          onPointerDown={onPointerDown} // was only applied to annotationRef, reason?
          onPointerUp={onPointerUp} // was only applied to annotationRef, reason?
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        >
          <circle id="backCircle"/>
          <circle id="frontCircle"/>
        </svg>

        <div ref={annotationRef}
          className={`annotation orangeHover ${sizeClass} ${isHovered && markerTitle ? 'visible' : ''}`}>
          <div className={`title ${sizeClass}`}>{markerTitle}</div>
        </div>

      </div>
    </Html>
  );
};

export default AnnotationOrangeHover;
