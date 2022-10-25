import create from 'zustand';
import {Object3DTypedArray} from 'webgl/types/Object3DTypedArray';
import {Configuration} from "../../../models/configuration";

// export type Object3DTypedArray = { [key: string]: Object3D[] };

export type ConfigurationStoreState = {
  configuration?: Configuration.DTO;
  setConfiguration: (value: Configuration.DTO | undefined) => Configuration.DTO | undefined;

  entitiesReady: boolean;


  isConfiguration3dReady: boolean;
  setConfiguration3dReadiness: (value: boolean) => void;

  sortedObjects: Object3DTypedArray;
  setSortedObjects: (sortedObjects: Object3DTypedArray) => void;
};

const configurationStore = create<ConfigurationStoreState>((set) => ({
  configuration: undefined,
  setConfiguration: (config) => {
    set({
      configuration: config,
      isConfiguration3dReady: false
    });
    return config;
  },
  entitiesReady: false,
  isConfiguration3dReady: false,
  setConfiguration3dReadiness: (value) => set({isConfiguration3dReady: value}),

  sortedObjects: {},
  setSortedObjects: (sortedObjects) => set({sortedObjects: sortedObjects})
}));

export {configurationStore};