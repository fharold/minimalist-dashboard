import React, {Dispatch, SetStateAction, useCallback, useRef, useState} from 'react';
import {Object3D} from 'three';
import {Html} from '@react-three/drei/web/Html';
import {sizeClassStore} from 'stores';
import {
  useAnnotationForcedAngle,
  useAnnotationHandleExpand,
  useAnnotationHandleOutline,
  useAnnotationPositioning,
  useGetObjectCenter,
  useHandleGotoState
} from 'webgl/hooks';

import './AnnotationBase.scss';
import {useTranslation} from 'react-i18next';

type AnnotationProps = {
  object: Object3D
  expandedUuidStateArray: [string, Dispatch<SetStateAction<string>>],
  point?: JSX.Element
}


const AnnotationBase: React.FC<AnnotationProps> = ({object, expandedUuidStateArray, point}: AnnotationProps) => {
  const {t} = useTranslation();
  const isPointerDown = useRef<boolean>(false);
  // const [title, setTitle] = useState<string>('titre'); // TODO retrieve from backend
  // const [description, setDescription] = useState<string>('description'); // TODO retrieve from backend
  const [title, setTitle] = useState<string>(t('annotation-181sx-title')); // TODO retrieve from backend
  const [description, setDescription] = useState<string>(t('annotation-181sx-description')); // TODO retrieve from backend
  const [distanceMultiplier] = useState<number | undefined>(object.userData.tags?.annotationDistanceMultiplier); // "top" instead of null by default

  const sizeClass = sizeClassStore(state => state.sizeClass);

  const position = useGetObjectCenter(object);
  const annotationAngle = useAnnotationForcedAngle(object.userData.tags?.annotationForcePosition);
  const [isExpanded, handleExpand] = useAnnotationHandleExpand(object, expandedUuidStateArray, description);
  const handleGotoState = useHandleGotoState(object);
  const handleOutline = useAnnotationHandleOutline(object);
  const [annotationRef, lineRef, overrideCalculatePosition] = useAnnotationPositioning(...annotationAngle, distanceMultiplier);

  const onPointerDown = useCallback(() => isPointerDown.current = true, []);
  const onPointerUp = useCallback(() => {
    if (!isPointerDown.current) return;

    const _isExpanded = handleExpand(); // using handleExpand() response because state isn't set yet
    handleGotoState();
    handleOutline(_isExpanded); // using handleExpand() response because state isn't set yet

    isPointerDown.current = false;
  }, [handleExpand, handleGotoState, handleOutline]);

  return (
    <Html
      zIndexRange={isExpanded ? [502, 501] : [500, 100]} // need component to update when changing zIndexRange
      style={{pointerEvents: 'none'}}
      position={[position.x, position.y, position.z]}
      calculatePosition={overrideCalculatePosition}
      name={'AnnotationGeneric Html'}
    >
      <div className="annotation-container">

        <svg className={`annotation-circle ${sizeClass}`}>
          <circle cx="1rem" cy="1rem" r=".9rem" stroke="black" strokeWidth="1.5px" fill="transparent"/>
        </svg>

        <svg className="annotation-line">
          <line ref={lineRef} stroke="black" strokeWidth="1.5px"/>
        </svg>

        <div ref={annotationRef} className={`annotation ${sizeClass}`} onPointerDown={onPointerDown}
             onPointerUp={onPointerUp}>
          <div className={`title ${sizeClass}`}>{title}</div>
          <div className={`description ${isExpanded ? 'expanded' : ''} ${sizeClass}`}>{description}</div>
        </div>

      </div>
    </Html>
  );
};

export default AnnotationBase;
