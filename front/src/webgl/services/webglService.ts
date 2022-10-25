import {unstable_batchedUpdates} from 'react-dom'; // or 'react-native'
import {canvasStore, renderStore, userAssetStore} from 'webgl/stores';
import {logHelper, tLogStyled} from 'utils/Logger';
import {Asset} from 'interfaces';
import {configurationStore} from 'webgl/stores/configurations/configurationStore';
import {Configuration} from "../../models/configuration";

// see https://docs.pmnd.rs/zustand/recipes#calling-actions-outside-a-react-event-handler
export const displayWebGLCanvas = (value: boolean) => unstable_batchedUpdates(() => {
  tLogStyled(`[webglService] displayWebGLCanvas(${value})`, logHelper.service, `WebGL Canvas is ${value ? 'visible' : 'hidden'}`); // DEBUG
  canvasStore.getState().setIsHidden(!value);
  renderStore.getState().setPauseRender(!value);
});

export const updateUserAssetList = (list: Asset[]): Asset[] => {
  unstable_batchedUpdates(() => {
    tLogStyled(`[webglService] updateUserAssetList()`, logHelper.service, list); // DEBUG
    userAssetStore.getState().setUserAssets(list); // watched by usePreloadAssets => will start loading GLTFs
  });
  return list;
};

export const updateWebGLConfiguration = (config?: Configuration.DTO) => unstable_batchedUpdates(() => {
  tLogStyled(`[webglService] updateWebGLConfiguration()`, logHelper.service, config); // DEBUG
  configurationStore.getState().setConfiguration(config);
});
