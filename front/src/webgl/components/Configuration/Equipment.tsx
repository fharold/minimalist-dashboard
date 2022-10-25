import React, {useCallback, useEffect, useRef} from 'react';
import {EquipmentEntity} from 'webgl/entities/EquipmentEntity';
import {FSMStore} from 'webgl/stores';
import {useHelper} from '@react-three/drei';
import {BoxHelper, Color, FrontSide} from 'three';

export type EquipmentState = {
  equipmentEntity: EquipmentEntity;
  castShadow: boolean
}

const Equipment: React.FC<EquipmentState> = ({equipmentEntity, castShadow = true}) => {
  const {setFSMState} = FSMStore(state => ({setFSMState: state.setFSMState}));
  const debugColor = useRef<Color>(new Color().setHSL(Math.random(), 1, .5));

  useEffect(() => {
    equipmentEntity.scene.traverse(obj => {
      obj.castShadow = castShadow;
      obj.receiveShadow = castShadow;

      // @ts-ignore
      const material = obj.material;
      if (material) {
        material.color = debugColor.current; // TODO REMOVE DEBUG
        material.side = FrontSide;
      }
    });
  }, [castShadow, equipmentEntity]);

  const gotoAssetState = useCallback((e) => {
    e.stopPropagation();
    if (e.delta <= 2) setFSMState(equipmentEntity.state);
  }, [equipmentEntity.state, setFSMState]);

  const eqRef = useRef(); // TODO DEBUG
  const helper = useHelper(eqRef, BoxHelper, debugColor.current.getHex()) as React.MutableRefObject<BoxHelper | undefined>; // TODO DEBUG
  helper.current?.setFromObject(eqRef.current!);

  // TODO while lerping camera, there's a shift in bounding boxes ???
  //  so raycasting is incorrect when lerping

  if (!equipmentEntity) return null;
  return (
    <primitive
      ref={eqRef}
      name={'Equipment Primitive (asset.scene)'}
      object={equipmentEntity.scene}
      position={equipmentEntity.pivotOffsetWorld}

      onClick={gotoAssetState}

      dispose={null}
    />
  );
};

export default Equipment;
