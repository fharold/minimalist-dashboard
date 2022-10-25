import {RefObject, useCallback, useRef} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import {CalculatePosition} from '@react-three/drei/web/Html';
import {MathUtils, Vector2, Vector3} from 'three';

type ScreenPosition = {
  x: number
  y: number
}

type LinePoints = {
  x1: number
  y1: number
  x2: number
  y2: number
}

const distanceScreenFactor = /*window.innerWidth * window.innerHeight / 1_000_000;*/ 1.25;
const annotationPadding = 10;

export const useAnnotationPositioning = (forcedAngle: number | null, forcedPercentages: Vector2, distanceMultiplier: number | undefined, alignCorner: boolean = false): [RefObject<HTMLDivElement>, RefObject<SVGLineElement>, CalculatePosition] => {
  const annotationRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  const screenPosition = useRef<ScreenPosition>({x: 0, y: 0});
  const screenPositionNormalized = useRef<ScreenPosition>({x: 0, y: 0});
  const screenAngle = useRef<number>(0);

  const {domElement} = useThree(({gl}) => gl);

  const getScreenPositionCentered: (position: number[], halves: number[]) => ScreenPosition =
    ([x, y], [xHalf, yHalf]) => {
      const normalizedScreenPos = {
        x: MathUtils.clamp((x - xHalf) / xHalf, -1, 1),
        y: MathUtils.clamp((y - yHalf) / yHalf, -1, 1)
      };

      return normalizedScreenPos;
    };


  const getScreenAngleFromNormalizedPosition = (normalizedScreenPos: ScreenPosition): number =>
    Math.atan2(normalizedScreenPos.y, normalizedScreenPos.x); // (-y) for trigo angle


  const shouldUpdate = (previous: ScreenPosition, next: ScreenPosition): boolean =>
    previous.x !== next.x && previous.y !== next.y;

  const getLinePoints = useCallback((): LinePoints => {
    const elem = annotationRef.current;
    if (elem) {
      const rect = elem.getBoundingClientRect();
      const domRect = domElement.getBoundingClientRect();
      const canvasOffset = {x: window.scrollX + domRect.left, y: window.scrollY + domRect.top};
      const centerX = rect.x - screenPosition.current.x + rect.width / 2 + 250 - canvasOffset.x; // 250 = svg width / 2 (svg is 500x500)
      const centerY = rect.y - screenPosition.current.y + rect.height / 2 + 250 - canvasOffset.y; // 250 = svg height / 2 (svg is 500x500)
      // TODO take Canvas top position into account => substract canvasOffset from line point position
      return {x1: 250, y1: 250, x2: centerX, y2: centerY};
    }
    return {x1: 0, y1: 0, x2: 0, y2: 0};
  }, [domElement]);


  const updateAnnotationPosition = useCallback((angle: number) => {
    const annotation = annotationRef.current;
    const line = lineRef.current;
    if (annotation) {

      const rect = annotation.getBoundingClientRect();

      if (alignCorner) {
        annotation.style.transform = `translate(${forcedPercentages.x}%, ${forcedPercentages.y}%)`;

      } else {
        const heightInfluence = 1 - Math.abs(Math.sin(angle * 2)) / 2;
        const multiplier = distanceMultiplier != null ? distanceMultiplier : 1;
        const distance = Math.sqrt(Math.pow(Math.cos(angle) * rect.width, 2) + Math.pow(Math.sin(angle) * rect.height, 2)) * distanceScreenFactor * multiplier + annotationPadding * multiplier;
        const xyCarth = new Vector2(Math.cos(angle) * 1.25, heightInfluence * Math.sin(angle) * 2).multiplyScalar(distance);
        const translation = xyCarth.clone().multiply(new Vector2(50 / rect.width, 50 / rect.height)).subScalar(-50);
        annotation.style.transform = `translate(${translation.x - 100}%, ${translation.y - 100}%)`;
        // TODO slows down fps...
      }
    }

    if (line) {
      // using state was slowing things down...
      const linePoints = getLinePoints();
      line.x1.baseVal.value = linePoints.x1;
      line.y1.baseVal.value = linePoints.y1;
      line.x2.baseVal.value = linePoints.x2;
      line.y2.baseVal.value = linePoints.y2;
    }
  }, [alignCorner, distanceMultiplier, forcedPercentages, getLinePoints]);


  const updateScreenPosition =
    useCallback((defaultPosition: number[], sizeHalves: { x: number, y: number }) => {

      // distance from top-left in pixels
      const newScreenPosition = {x: defaultPosition[0], y: defaultPosition[1]};
      if (shouldUpdate(screenPosition.current, newScreenPosition))
        screenPosition.current = newScreenPosition;

      // normalized distance from center (-1,-1) = top-left / (1,1) = bottom-right
      const newScreenPositionNormalized = getScreenPositionCentered(defaultPosition, [sizeHalves.x, sizeHalves.y]);
      if (shouldUpdate(screenPositionNormalized.current, newScreenPositionNormalized)) {
        screenPositionNormalized.current = newScreenPositionNormalized;
        screenAngle.current = forcedAngle !== null ? forcedAngle : getScreenAngleFromNormalizedPosition(newScreenPositionNormalized);
      }

    }, [forcedAngle]);


  const overrideCalculatePosition: CalculatePosition = (targetObject, camera, size) => {
    // get targetObject position in screen space pixels
    const objectPos = (new Vector3()).setFromMatrixPosition(targetObject.matrixWorld);
    objectPos.project(camera);
    if (isNaN(objectPos.x) || isNaN(objectPos.y) || isNaN(objectPos.z)) objectPos.set(0, 0, 0); // TODO DEBUG
    const sizeHalves = {x: size.width / 2, y: size.height / 2};
    const defaultPosition = [objectPos.x * sizeHalves.x + sizeHalves.x, -(objectPos.y * sizeHalves.y) + sizeHalves.y];

    updateScreenPosition(defaultPosition, sizeHalves);

    return defaultPosition;
  };


  // translate annotation
  useFrame(() => {
    updateAnnotationPosition(screenAngle.current);
  });


  return [annotationRef, lineRef, overrideCalculatePosition];
};
