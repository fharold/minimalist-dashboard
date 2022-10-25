import React, {useEffect, useRef} from 'react';
import {Sphere} from '@react-three/drei';
import {BackSide, Mesh, ShaderMaterial} from 'three';
import {useThree} from '@react-three/fiber';
import 'webgl/components/SphericalGradientBackground';

const BackgroundSphere: React.FC = () => {
  const mesh = useRef<Mesh>();

  const sphereMaterial = useRef<ShaderMaterial>();
  const viewport = useThree(state => state.viewport);

  // material resolution
  useEffect(() => {
    const width = viewport.width * viewport.factor;
    const height = viewport.height * viewport.factor;
    const s = 1; // 2 if antialiasing
    sphereMaterial.current?.uniforms.resolution.value.set(s * width, s * height);
  }, [viewport.factor, viewport.height, viewport.width]);

  // TODO adapt to objects size

  return (
    <Sphere ref={mesh} args={[25]}>
      {/*<meshNormalMaterial attach="material" side={BackSide} toneMapped={false}/>*/}

      {/*@ts-ignore*/}
      <sphericalGradientMaterial ref={sphereMaterial} attach="material" side={BackSide}/>

      {/*<meshBasicMaterial attach="material" color={'white'} side={BackSide} toneMapped={false}/>*/}
    </Sphere>
  );
};

export default BackgroundSphere;