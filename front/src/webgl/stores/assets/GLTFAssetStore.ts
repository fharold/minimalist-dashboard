import create from 'zustand';
import {GLTF} from 'three/examples/jsm/loaders/GLTFLoader';
import {logHelper, tLogStyled} from 'utils/Logger';
import {Asset3D} from 'webgl/interfaces';

export type AssetState = {
  // raw assets
  gltfAssets: GLTF[];
  setGltfAssets: (assets: GLTF[]) => GLTF[];

  // parsed assets
  isParsing: boolean;
  setIsParsing: (value: boolean) => void;
  parsedAssets: Asset3D[];
  setParsedAssets: (assets: Asset3D[]) => Asset3D[];
}

export const GLTFAssetStore = create<AssetState>((set) => ({
  gltfAssets: [],
  setGltfAssets: (assets) => {
    tLogStyled('[GLTFAssetStore.setGltfAssets] GLTF assets has been updated', logHelper.finishedLoading, assets);
    set({gltfAssets: assets});
    return assets; // allow chaining .then()
  },

  isParsing: true,
  setIsParsing: (value) => set({isParsing: value}),
  parsedAssets: [],
  setParsedAssets: (parsedAssets) => {
    tLogStyled('[GLTFAssetStore.setParsedAssets] Parsed assets has been updated', logHelper.finishedLoading, parsedAssets);
    set({parsedAssets: parsedAssets});
    return parsedAssets; // allow chaining .then()
  },
}));