import {useEffect, useState} from 'react';
import {Vector3} from 'three/src/Three';
import {cameraStore, configurationStore, GLTFAssetStore} from 'webgl/stores';
import {EquipmentEntity} from 'webgl/entities/EquipmentEntity';
import {AssetEntity} from 'webgl/entities/AssetEntity';
import {Asset3D} from 'webgl/interfaces';
import {useUpdateLineStates} from 'webgl/hooks/configuration/useUpdateLineStates';
import {useUpdateLineVirtualCameras} from 'webgl/hooks/configuration/useUpdateLineVirtualCameras';
import {useUpdateLineSortedObjects} from 'webgl/hooks/configuration/useUpdateLineSortedObjects';
import {logHelper, tLogStyled} from 'utils/Logger';
import {Configuration} from "../../../models/configuration";

const getEquipmentEntities = (entityKeys: string[], assets: Asset3D[]): EquipmentEntity[] => {
  const _newEquipmentAssets: EquipmentEntity[] = [];
  entityKeys?.forEach(eqKey => {
    const equip = assets.find(asset => asset.key === eqKey);
    if (equip !== undefined) {
      const equipment = new EquipmentEntity(equip);
      _newEquipmentAssets.push(equipment);
    }
  });
  return _newEquipmentAssets;
};
const applyEquipmentOffsets = (entities: EquipmentEntity[] = []) => {
  const _currentOffset: Vector3 = new Vector3();
  entities.forEach(entity => {
    entity.setPivotOffset(_currentOffset);
    entity.scene.updateMatrix();
    _currentOffset.add(entity.nextPivotPosition);
    // TODO doesn't take into account initial position of equipment pivot...
  });
};

const getAssetEntity = (entityKey: string, assets: Asset3D[]): AssetEntity | undefined => {
  const asset = assets.find(asset => asset.key === entityKey);
  if (asset) {
    return new AssetEntity(asset);
  }
};

type GetConfigurationAssetsResponse = [
  equipmentAssets?: EquipmentEntity[],
  crateAsset?: AssetEntity,
  crateContentAsset?: AssetEntity
];

export const useGetConfigurationEntities = (configuration?: Configuration.DTO): GetConfigurationAssetsResponse => {
  const parsedAssets = GLTFAssetStore(state => state.parsedAssets);
  const setConfigurationReadiness = configurationStore(state => state.setConfiguration3dReadiness);
  const resetVirtualCameras = cameraStore(state => state.resetVirtualCameras);

  const [equipmentEntities, setEquipmentEntities] = useState<EquipmentEntity[]>();
  const [crateEntity, setCrateEntity] = useState<AssetEntity>();
  const [crateContentEntity, setCrateContentEntity] = useState<AssetEntity>();

  useEffect(() => {
    setConfigurationReadiness(false); // moved to ConfigurationViewer
    resetVirtualCameras();
    tLogStyled('[useGetConfigurationEntities] resetVirtualCameras()', logHelper.debug);

    if (configuration && configuration.key) {
      if (parsedAssets.length === 0) {
        tLogStyled(`[useGetConfigurationEntities] New configuration received but no loaded asset available`, logHelper.error, configuration, parsedAssets); // DEBUG

      } else { // parsedAssets length > 0

        // Equipments
        const _newEquipmentEntities = getEquipmentEntities(configuration.equipmentKeys, parsedAssets);
        applyEquipmentOffsets(_newEquipmentEntities);
        setEquipmentEntities(_newEquipmentEntities);

        // Crate
        const _newCrateEntity = getAssetEntity(configuration.crateKey, parsedAssets);
        setCrateEntity(_newCrateEntity);

        // Crate Content
        const _newCrateContentEntity = getAssetEntity(configuration.crateContentKey, parsedAssets);
        setCrateContentEntity(_newCrateContentEntity);

        // setConfigurationReadiness(true); // moved to useUpdateLineVirtualCameras.ts
      }
    }
  }, [configuration, parsedAssets, resetVirtualCameras, setConfigurationReadiness]);

  // useUpdateLineStates(equipmentEntities);
  // useUpdateLineSortedObjects(equipmentEntities);
  // useUpdateLineVirtualCameras(equipmentEntities);

  return [equipmentEntities, crateEntity, crateContentEntity];
};
