import React, {useMemo, useRef} from 'react';
import {Environment} from '@react-three/drei';
import {DirectionalLight, Vector2} from 'three';

const Lighting: React.FC = () => {
  const light = useMemo(() => {
    const light = new DirectionalLight(0xffffff);
    light.intensity = 5;
    light.castShadow = true;
    light.shadow.mapSize = new Vector2(1024, 1024);
    light.shadow.bias = -0.00025;
    return light;
  }, []);

  const lightRef = useRef();

  return (
    <>
      <Environment files={'/assets/hdri/empty_warehouse_01_1k_edited.hdr'} background={false}/>
      <primitive ref={lightRef} object={light} position={[0, 15, -1]}/>
      <primitive object={light.target} position={[0, 0, 0]}/>
    </>
  );
};

export default Lighting;