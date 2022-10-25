import {FSMStore, GLTFAssetStore} from 'webgl/stores';
import {useCallback, useEffect} from 'react';
import {logHelper, tLogStyled} from 'utils/Logger';
import {GLTF} from 'three/examples/jsm/loaders/GLTFLoader';
import {Asset3D} from 'webgl/interfaces';
import {Object3D} from 'three/src/core/Object3D';
import {FSMStates} from 'webgl/types/FSMStates';

const parseObjectTags = (scene: Object3D) => {
  scene.traverse(obj => {
    try {
      // from json text to js objects
      obj.userData.tags = JSON.parse(obj.userData.tags);
    } catch (e) {/* noop */
    }
  });
  return scene;
};

const useParseGLTFAssets = () => {
  const {gltfAssets, setIsParsing, setParsedAssets} = GLTFAssetStore(state => ({
    gltfAssets: state.gltfAssets,
    setIsParsing: state.setIsParsing,
    setParsedAssets: state.setParsedAssets,
  }));
  const setFSMState = FSMStore(state => state.setFSMState);

  const parseAssets = useCallback((assets: GLTF[]) => {
    const parsingPromises: Promise<Asset3D>[] = [];

    if (assets && assets.length > 0) {
      setFSMState(FSMStates.parsing);
      setIsParsing(true);
      tLogStyled('[useParseGLTFAssets] Begin parsing GLTF assets', logHelper.startLoading, assets);
      assets.forEach(asset => {
        // tLogStyled('[useParseGLTFAssets.parseGLTFAssets] Parsing', logHelper.loading, asset);
        const promise = new Promise<Asset3D>((resolve, reject) => {
          parseObjectTags(asset.scene);

          asset.scene.userData.key = asset.userData.key;

          resolve({
            ...asset.userData,
            scene: asset.scene,
            animations: asset.animations,
            cameras: asset.cameras
          }); // TODO
        });
        parsingPromises.push(promise);
      });
    }

    return Promise.all(parsingPromises)
      .then(res => {
        setFSMState(FSMStates.parsed);
        return res;
      });
  }, [setFSMState, setIsParsing]);

  useEffect(() => {
    if (gltfAssets && gltfAssets.length > 0) {
      parseAssets(gltfAssets)
        .then(parsedAssets => setParsedAssets(parsedAssets))
        .then(() => setIsParsing(false))
        // .then(() => setFSMState(FSMStates.hidden))
    }
  }, [gltfAssets, parseAssets, setFSMState, setIsParsing, setParsedAssets]);

  return null;
};

export {useParseGLTFAssets};