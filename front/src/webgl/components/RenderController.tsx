import React, {useCallback, useEffect, useRef} from 'react';
import {Stats} from '@react-three/drei'; // DEBUG
import {renderStore} from 'webgl/stores';
import {useIdle} from 'react-use';
import {useFrame, useThree} from '@react-three/fiber';
import {DefaultValues} from 'webgl/types/DefaultValues';

const RenderController: React.FC = () => {
  const {setIsIdle, pauseRender} = renderStore(state => ({
    setIsIdle: state.setIsIdle,
    pauseRender: state.pauseRender
  }));
  const ignoreIdle = useRef<boolean>(false);
  const isIdle = useIdle(DefaultValues.renderPauseDelay, false); // events: ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
  const invalidate = useThree(state => state.invalidate);
  const setThree = useThree(state => state.set);

  const shouldRender = useCallback(() => {
    if (!pauseRender && (!isIdle || ignoreIdle.current)) {
      // setThree({frameloop: 'demand'});
      invalidate();
    }
  }, [invalidate, isIdle, pauseRender, setThree]);

  useFrame((state) => {
    shouldRender();
  });

  useEffect(() => {
    if (DefaultValues.renderPauseDelay > 0) {
      ignoreIdle.current = false;
      setIsIdle(isIdle);
      shouldRender();
    } else {
      ignoreIdle.current = true;
    }
  }, [isIdle, pauseRender, setIsIdle, shouldRender]);

  // return null;

  // DEBUG FPS
  return <Stats
    showPanel={0} // Start-up panel (default=0)
    className="stats" // Optional className to add to the stats container dom element
  />;
};

export default RenderController;