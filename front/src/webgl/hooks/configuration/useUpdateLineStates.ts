import {EquipmentEntity} from 'webgl/entities/EquipmentEntity';
import {FSMStates} from 'webgl/types/FSMStates';
import {useEffect} from 'react';
import {logHelper, tLogStyled} from 'utils/Logger';

export const useUpdateLineStates = (equipmentEntities?: EquipmentEntity[]): void => {
  useEffect(() => {
    FSMStates.line = {default: 'line.default'};

    if (equipmentEntities) {
      equipmentEntities?.forEach(equip => {
        FSMStates.line[equip.key] = equip.state;
      });
    }

    tLogStyled('[useUpdateLineStates]', logHelper.subdued, FSMStates);
  }, [equipmentEntities]);
};