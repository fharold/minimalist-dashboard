import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Object3D} from 'three';
import {Html} from '@react-three/drei/web/Html';
import {sizeClassStore} from 'stores';
import {
  useAnnotationForcedAngle,
  useAnnotationHandleOutline,
  useGetObjectCenter,
  useHandleGotoState
} from 'webgl/hooks';

import './AnnotationBase.scss';
import './AnnotationOrangeFixed.scss';

type OrangeFixedCircleProps = {
  markerChar: string,
  animated?: boolean
  opaque?: boolean
} & React.SVGProps<SVGSVGElement>;

export const OrangeFixedCircle: React.FC<OrangeFixedCircleProps> = ({
                                                                      markerChar,
                                                                      animated = true,
                                                                      opaque = false,
                                                                      ...props
                                                                    }) => {
  const sizeClass = sizeClassStore(state => state.sizeClass);

  return (
    <svg className={`annotation-circle orangeFixed ${animated ? 'animated' : ''} ${sizeClass}`} {...props}
      viewBox="0 0 37.14 39.89">
      <circle id="backCircle" className={`${opaque ? 'opaque' : ''}`}/>
      <path id="contour" d="M35.14,29.48a17.94,17.94,0,1,1,0-19.07"/>
      <text id="text" transform="translate(13.97 27)">{markerChar}</text>
    </svg>
  );
};

type AnnotationProps = {
  object: Object3D
};

const AnnotationOrangeFixed: React.FC<AnnotationProps> = ({object}) => {
  // const sizeClass = sizeClassStore(state => state.sizeClass);

  const isPointerDown = useRef<boolean>(false);
  const [markerChar, setMarkerChar] = useState<string>('a'); // TODO retrieve from backend
  const [isHovered, setHovered] = useState<boolean>(false);

  // const [distanceMultiplier] = useState<number | undefined>(object.userData.tags?.annotationDistanceMultiplier || 0.8); // "top" instead of null by default

  const position = useGetObjectCenter(object);
  // const annotationAngle = useAnnotationForcedAngle(object.userData.tags?.annotationForcePosition);
  const handleGotoState = useHandleGotoState(object);
  const handleOutline = useAnnotationHandleOutline(object);
  // const [annotationRef, , overrideCalculatePosition] = useAnnotationPositioning(...annotationAngle, distanceMultiplier);

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
      // calculatePosition={overrideCalculatePosition}
      name={'AnnotationOrangeFixed Html'}
    >
      <div className="annotation-container">

        <OrangeFixedCircle markerChar={markerChar}
          onPointerDown={onPointerDown} // was only applied to annotationRef, reason?
          onPointerUp={onPointerUp} // was only applied to annotationRef, reason?
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        />

      </div>
    </Html>
  );
};

export default AnnotationOrangeFixed;
