import {useEffect} from 'react';
import {sizeClassStore} from 'stores';

const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

const handleScaleWithScreenSize = (
  screenSize: { x: number, y: number },
  referenceResolution: { x: number, y: number },
  matchWidthOrHeight: number
) => {
  const logWidth = Math.log(screenSize.x / referenceResolution.x);
  const logHeight = Math.log(screenSize.y / referenceResolution.y);
  const logWeightedAverage = lerp(
    logWidth,
    logHeight,
    Math.min(1, Math.max(0, matchWidthOrHeight))
  );
  return Math.pow(2, logWeightedAverage);
};

/**
 * Sets **`font-size`** inline property to the HTML tag.
 * @param referenceResolution The resolution the layout is designed for
 * @param matchWidthOrHeight Determines if the scaling is using the width or height as reference, or a mix in between
 * @param minFontSize Minimum font-size. Can't scale down below this value. (default 12)
 * @param baseFontSize Base font-size that will be scaled up or down. (default 16)
 * @returns appRef reference to use with app div container
 */
const useScaleWithScreenSize = (
  referenceResolution: { x: number, y: number },
  matchWidthOrHeight: number,
  minFontSize: number = 10,
  baseFontSize: number = 16
) => {
  const {width, height} = sizeClassStore(state => ({
    width: state.width,
    height: state.height
  }));

  useEffect(() => {
    if (width && height) {
      const scaleFactor = handleScaleWithScreenSize({x: width, y: height}, referenceResolution, matchWidthOrHeight);
      document.documentElement.style.fontSize = `${Math.max(minFontSize, baseFontSize * scaleFactor)}px`; // <html> inline style
    }
  }, [width, height, referenceResolution, matchWidthOrHeight, minFontSize, baseFontSize]);

  // return appRef;
};

export {useScaleWithScreenSize};
