import {useEffect, useState} from 'react';
import {Vector2} from 'three';

export const useAnnotationForcedAngle = (annotationForcePosition?: string): [number | null, Vector2] => {
  const [forcedAngle, setForcedAngle] = useState<number | null>(-Math.PI / 2); // "top" instead of null by default
  const [forcedPercentages, setPercentages] = useState<Vector2>(new Vector2(-50, -100));

  useEffect(() => {
    let _angle: number | null;
    let _percentages: Vector2;
    switch (annotationForcePosition) {
      case 'topLeft':
        _angle = (-3 * Math.PI / 4);
        _percentages = new Vector2(-100, -100);
        break;
      // case 'top': // DEFAULT
      //   _angle = (-Math.PI / 2);
      //   _percentages = new Vector2(-50, -100);
      //   break;
      case 'topRight':
        _angle = (-Math.PI / 4);
        _percentages = new Vector2(0, -100);
        break;
      case 'right':
        _angle = (0);
        _percentages = new Vector2(100, -50);
        break;
      case 'bottomRight':
        _angle = (Math.PI / 4);
        _percentages = new Vector2(100, 0);
        break;
      case 'bottom':
        _angle = (Math.PI / 2);
        _percentages = new Vector2(-50, 0);
        break;
      case 'bottomLeft':
        _angle = (3 * Math.PI / 4);
        _percentages = new Vector2(-100, 0);
        break;
      case 'left':
        _angle = (Math.PI);
        _percentages = new Vector2(-100, -50);
        break;
      case 'top':
      default:
        _angle = (-Math.PI / 2);
        _percentages = new Vector2(-50, -100);
        break;
    }

    setForcedAngle(_angle);
    setPercentages(_percentages);
  }, [annotationForcePosition]);

  return [forcedAngle, forcedPercentages];
};