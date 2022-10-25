import create from 'zustand';
import {Asset} from 'interfaces';

type UserAssetsState<T> = {
  userAssets: T[];
  setUserAssets: (value: T[]) => T[];
  getAssetByKey: (key?: string) => T | undefined;
};

const userAssetStore = create<UserAssetsState<Asset>>((set, get) => ({
  userAssets: [],
  setUserAssets: (value) => {
    set({userAssets: value});
    return value;
  },
  getAssetByKey: (key) => get().userAssets.find(asset => asset.key === key)
}));

export {userAssetStore};