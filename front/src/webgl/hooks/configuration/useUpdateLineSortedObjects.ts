import {AssetEntity} from 'webgl/entities/AssetEntity';
import {useEffect} from 'react';
import {Object3DTypedArray} from 'webgl/types/Object3DTypedArray';
import {configurationStore} from 'webgl/stores';

/**
 * Get all SortedObjects from Line assets and regroup them in a unique named array
 * to push them into configurationStore.sortedObjects.
 */
export const useUpdateLineSortedObjects = (assetEntities?: AssetEntity[]) => {
  const setSortedObjects = configurationStore(state => state.setSortedObjects);
  useEffect(() => {
    const lineSortedObjects: Object3DTypedArray = {};
    if (assetEntities && assetEntities.length > 0) {
      // TODO REFACTOR BELOW (mainly copied from AssetEntity)
      const firstItemOf = (type: string) => !lineSortedObjects[type];
      const initializePropertyOf = (type: string) => lineSortedObjects[type] = [];
      assetEntities.forEach(eq => {
        for (let type in eq.sortedObjects) {
          if (eq.sortedObjects.hasOwnProperty(type)) {
            if (firstItemOf(type)) initializePropertyOf(type);
            lineSortedObjects[type].push(...eq.sortedObjects[type]);
          }
        }
      });
    }
    console.log('Line sortedObjects', lineSortedObjects);
    setSortedObjects(lineSortedObjects);
  }, [assetEntities, setSortedObjects]);
};