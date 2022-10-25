import {useRef} from 'react';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
// TODO ADD MESHOPT DECODER!

const useGLTFLoader = () => {
  const gltfLoader = useRef(new GLTFLoader());
  const dracoLoader = useRef(new DRACOLoader());
  gltfLoader.current.setWithCredentials(true);
  dracoLoader.current.setDecoderPath('/assets/draco/');
  gltfLoader.current.setDRACOLoader(dracoLoader.current);

  return gltfLoader.current;
};

export {useGLTFLoader};