import React, {useCallback} from 'react';
import {PerspectiveCamera} from 'three';
import {EquipmentEntity} from 'webgl/entities/EquipmentEntity';
import {Center} from '@react-three/drei';
import {FSMStates} from 'webgl/types/FSMStates';
import {FSMStore} from 'webgl/stores';
import {useLineCameraPosition} from 'webgl/hooks/configuration/useLineCameraPosition';
import Equipment from 'webgl/components/Configuration/Equipment';

type LineState = {
  equipments: EquipmentEntity[];
  defaultCamera?: PerspectiveCamera
};

const Line: React.FC<LineState> = ({equipments}) => {
  const setFSMState = FSMStore(state => state.setFSMState);

  const {lineRef} = useLineCameraPosition();

  const returnToLineState = useCallback((e: MouseEvent) => {
    if (e.button === 0) setFSMState(FSMStates.line.default);
  }, [setFSMState]);

  if (!equipments) return null;
  return (
    // TODO when zooming back to line, there's a problem with Center component that glitches Equipments position...
    <Center ref={lineRef} name={'Center Group'} alignTop onPointerMissed={returnToLineState}>
      {equipments.map(eq =>
        <Equipment key={eq.key} equipmentEntity={eq} castShadow/>
      )}
    </Center>
  );
};

export default Line;
