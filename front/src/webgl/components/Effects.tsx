import React, {useRef} from 'react';
import {EffectComposer, Outline, OutlineProps} from '@react-three/postprocessing';
// @ts-ignore
import {BlendFunction} from 'postprocessing';
import {outlineStore} from 'webgl/stores';

// https://github.com/pmndrs/react-postprocessing/blob/master/api.md

const Effects: React.FC = () => {
  const outlineRef = useRef<OutlineProps>(null);
  const selectedObjects = outlineStore(state => state.selectedObjects);

  return (
    <EffectComposer autoClear={false}>
      { /* if autoClear not set to false, outline doesn't render */}
      <Outline ref={outlineRef}
               selection={selectedObjects}
               blendFunction={BlendFunction.ALPHA} // set this to BlendFunction.ALPHA for dark outlines
               edgeStrength={10} // the edge strength
               visibleEdgeColor={0x00eeff} // the color of visible edges
               hiddenEdgeColor={0x00eeff} // the color of hidden edges
        // width={512} // render width
        // height={512} // render height
        // kernelSize={KernelSize.SMALL} // blur kernel size
               blur={true} // whether the outline should be blurred
               xRay={true} // indicates whether X-Ray outlines are enabled
      />
    </EffectComposer>
  );
};

export default Effects;
