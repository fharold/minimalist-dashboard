import React, {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from 'react';
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
import './AnnotationBlueHover.scss';

type AnnotationProps = {
  object: Object3D
}

const AnnotationBlueHover: React.FC<AnnotationProps> = ({object}: AnnotationProps) => {
  const sizeClass = sizeClassStore(state => state.sizeClass);

  const isPointerDown = useRef<boolean>(false);
  const [markerNumber, setNumber] = useState<string>('4'); // TODO retrieve from backend
  const [markerTitle, setTitle] = useState<string>('Adéquation machine et travail à réaliser'); // TODO retrieve from backend
  const [isHovered, setHovered] = useState<boolean>(false);

  const [distanceMultiplier] = useState<number | undefined>(object.userData.tags?.annotationDistanceMultiplier || 0.8); // "top" instead of null by default

  const position = useGetObjectCenter(object);
  const annotationAngle = useAnnotationForcedAngle(object.userData.tags?.annotationForcePosition);
  const handleGotoState = useHandleGotoState(object);
  const handleOutline = useAnnotationHandleOutline(object); // TODO maybe outline object when hovering? => todo later
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
      name={'AnnotationBlueHover Html'}
    >
      <div className="annotation-container">

        <svg className={`annotation-circle blueHover ${sizeClass} `}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        >
          <circle id="backCircle"/>
          <circle id="frontCircle"/>
          <text x="50%" y="50%" dy=".3em">{markerNumber}</text>
        </svg>

        <div ref={annotationRef}
          className={`annotation blueHover ${sizeClass} ${isHovered && markerTitle ? 'visible' : ''}`}>
          <div className={`title ${sizeClass}`}>{markerTitle}</div>
        </div>

      </div>
    </Html>
  );
};

export default AnnotationBlueHover;
