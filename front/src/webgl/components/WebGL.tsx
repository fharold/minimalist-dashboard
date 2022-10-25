import React, {useEffect} from 'react';
import {logHelper, tLogStyled} from 'utils/Logger';
import {useParseGLTFAssets, usePreloadGLTFAssets} from 'webgl/hooks';
import {Asset} from 'interfaces';
import {loadingStore, userAssetStore} from 'webgl/stores';
import WebGLCanvas from 'webgl/components/WebGLCanvas';

const WebGL: React.FC = () => {
  const userAssets = userAssetStore(state => state.userAssets);

  // const percentageLoaded = loadingStore(state => state.percentageLoaded);
  // useEffect(() => tLogStyled('Global loading progress', logHelper.loading, `${percentageLoaded}%`), [percentageLoaded]); // TODO DEBUG

  usePreloadGLTFAssets<Asset[]>(userAssets); // Load files
  useParseGLTFAssets();


  return (
    <WebGLCanvas/>
  );
};

export default WebGL;