import React from 'react';
import {configurationStore, GLTFAssetStore, loadingStore} from 'webgl/stores';
import {
  useCameraController,
  useGetConfigurationEntities,
  useUpdateLineSortedObjects,
  useUpdateLineStates, useUpdateLineVirtualCameras
} from 'webgl/hooks';
import {Plane} from '@react-three/drei';
import Line from 'webgl/components/Configuration/Line';
import Annotations from 'webgl/components/Annotations/Annotations';

const Configuration3D: React.FC = () => {
  const {isLoading} = loadingStore(state => ({isLoading: state.isLoading}));
  const {isParsing} = GLTFAssetStore(state => ({isParsing: state.isParsing}));
  const {configuration, isConfiguration3dReady} = configurationStore(state => ({
    configuration: state.configuration,
    isConfiguration3dReady: state.isConfiguration3dReady
  }));


  const [equipmentEntities, crateEntity, crateContentEntity] = useGetConfigurationEntities(configuration);

  useUpdateLineStates(equipmentEntities);
  useUpdateLineSortedObjects(equipmentEntities);
  useUpdateLineVirtualCameras(equipmentEntities);

  useCameraController();

  if (isLoading || isParsing) return null;
  if (!configuration || !isConfiguration3dReady) return null;
  if (!equipmentEntities/* || !crateAsset || !crateContentAsset*/) return null;

  return (
    <group name={'Configuration3D Group'}>
      {/* EQUIPMENT CHAIN */}
      <Line equipments={equipmentEntities}/>

      {/* CRATE */}
      {/*<primitive object={crateAsset} />*/}

      {/* CRATE CONTENT */}
      {/*<primitive object={crateContentAsset}/>*/}

      <Plane args={[10, 10]} rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow castShadow>
        <meshStandardMaterial color={'white'}/>
      </Plane>

      <Annotations/>
    </group>
  );
};

export default Configuration3D;