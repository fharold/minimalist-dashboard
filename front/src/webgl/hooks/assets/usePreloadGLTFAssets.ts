import {logHelper, tLogError, tLogStyled} from 'utils/Logger';
import {useCallback, useEffect} from 'react';
import {GLTF} from 'three/examples/jsm/loaders/GLTFLoader';
import {useGLTFLoader} from 'webgl/hooks';
import {FSMStore, GLTFAssetStore, loadingStore} from 'webgl/stores';
import {Asset} from 'interfaces';
import {FSMStates} from 'webgl/types/FSMStates';

const usePreloadGLTFAssets = <T extends Asset[]>(assetList: T) => {

  const loader = useGLTFLoader();
  const setGltfAssets = GLTFAssetStore(state => state.setGltfAssets);
  const {setIsLoading, resetLoadedBytes, setLoadedBytes, setLoadingError} = loadingStore(state => ({
    setIsLoading: state.setIsLoading,
    resetLoadedBytes: state.resetLoadedBytes,
    setLoadedBytes: state.setLoadedBytes,
    setLoadingError: state.setLoadingError
  }));
  const setFSMState = FSMStore(state => state.setFSMState);

  const loadAssets = useCallback((assetList: T) => {
    const loadingPromises: Promise<GLTF>[] = [];

    if (assetList && assetList.length > 0) {
      setFSMState(FSMStates.loading);
      tLogStyled('[usePreloadGLTFAssets.loadAssets] Begin loading assets', logHelper.startLoading, assetList);
      const totalSize = assetList.reduce((prevSum, asset) => prevSum + asset.fileSize, 0);

      resetLoadedBytes();
      setIsLoading(true, totalSize);

      assetList.forEach(asset => {
        // tLogStyled('[usePreloadGLTFAssets.loadAssets] Loading file', logHelper.loading, asset.url);
        const promise = loader.loadAsync(asset.url, xhr => setLoadedBytes(asset.url, xhr.loaded));
        promise.then(loadedAsset => {
          loadedAsset.userData = asset;
          return loadedAsset;
        }).catch(tLogError);
        loadingPromises.push(promise);
      });
    } //endif


    return Promise.allSettled(loadingPromises) // Promise.allSettled() instead of Promise.all() to prevent "all or nothing" behavior
      .then(res => res.filter(res => res.status === 'fulfilled') as PromiseFulfilledResult<GLTF>[]) // prevent blocking all assets due to one error
      .then(res => {
        setFSMState(FSMStates.loaded);
        return res.map(x => x.value);
      });
    
  }, [loader, resetLoadedBytes, setFSMState, setIsLoading, setLoadedBytes]);

  // Retrieve asset list from API
  useEffect(() => {
  // useEffectDebugger(() => {
    if (assetList && assetList.length > 0) {
      loadAssets(assetList)

        .then(gltfAssets => setGltfAssets(gltfAssets))
        .then(() => setIsLoading(false))

        .catch(error => {
          tLogError(error);
          setLoadingError(error);
        });
    }
  }, [assetList, loadAssets, setFSMState, setGltfAssets, setIsLoading, setLoadingError]);
  // }, [assetList, loadAssets, setGltfAssets, setIsLoading, setLoadingError], ['assetList', 'loadAssets', 'setGltfAssets', 'setIsLoading', 'setLoadingError'], 'usePreloadGLTFAssets');

  return null;
};

export {usePreloadGLTFAssets};