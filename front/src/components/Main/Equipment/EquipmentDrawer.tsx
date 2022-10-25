import React, {useCallback, useEffect, useState} from 'react';
import {FSMStore, userAssetStore} from 'webgl/stores';
import {FSMStates} from 'webgl/types/FSMStates';
import {EquipmentViewer} from 'components/Main/Equipment/EquipmentViewer';
import {Equipment} from 'models/equipment';
import {ServiceRepository} from 'services/serviceRepository';
import {useStateSafe} from 'hooks';
import {logHelper, tLogStyled} from 'utils/Logger';

import './EquipmentDrawer.scss';

const equipmentSvc = ServiceRepository.getInstance().equipmentSvc;

const EquipmentDrawer: React.FC = () => {
  const currentFSMState = FSMStore(state => state.currentFSMState);
  const getAssetByKey = userAssetStore(state => state.getAssetByKey);
  const isSubStateOf = FSMStore(state => state.isSubStateOf);
  const [isVisible, setVisibility] = useState<boolean>(false);
  const [isExpanded, setExpanded] = useState<boolean>(false);

  const [equipment, setEquipment] = useStateSafe<Equipment.DTO>();
  const [assetId, setAssetId] = useState<string>();

  // WHEN STATE CHANGES
  useEffect(() => {
    const _asset = getAssetByKey(currentFSMState?.split('.').slice(-1).pop()); // key => last element of currentFSMState (xxx.yyy.key)
    setAssetId(_asset?.id);
    tLogStyled(`[EquipmentDrawer] State changed, asset.key: ${_asset?.key}, asset.id: ${_asset?.id}`, logHelper.subdued);

    const visible = isSubStateOf(FSMStates.line) && currentFSMState !== FSMStates.line.default && !!_asset?.id;
    setVisibility(visible);
    setExpanded(visible);
  }, [currentFSMState, getAssetByKey, isSubStateOf, setEquipment]);

  // WHEN ID CHANGES
  useEffect(() => {
    const loadEquipment = async (id: string) => {
      const _equipment = await equipmentSvc.getEquipment(id);
      setEquipment(_equipment);
      return _equipment;
    };

    if (assetId) {
      loadEquipment(assetId)
        .then(eq => tLogStyled('[EquipmentDrawer] Equipment DTO (from DB) corresponding to state:', logHelper.subdued, eq));
    } else {
      setEquipment(undefined);
      tLogStyled('[EquipmentDrawer] Equipment DTO (from DB) is undefined', logHelper.subdued);
    }
  }, [assetId, setEquipment]);

  const closeDrawer = useCallback(() => setExpanded(false), []);
  const openDrawer = useCallback(() => setExpanded(true), []);

  return (
    <div
      className={`equipment-drawer ${isExpanded ? 'equipment-drawer-expanded' : ''} ${isVisible ? '' : 'equipment-drawer-hidden'}`}>

      <div className={'equipment-drawer-close-button'} title={'Close drawer'} onPointerUp={closeDrawer}/>

      {/*{isVisible &&*/}
      <div className={`fill-parent`} style={isExpanded ? {visibility: 'visible'} : {visibility: 'hidden'}}>
        <EquipmentViewer equipment={equipment}/></div>
      {/*}*/}

      <div
        className={`equipment-drawer-collapsed ${isExpanded ? '' : 'equipment-drawer-collapsed-visible'} flex flex-center`}
        onPointerUp={openDrawer}>
        Learn More{/* TODO translation using i18n */}
      </div>

    </div>
  );
};

export default EquipmentDrawer;