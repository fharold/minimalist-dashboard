import React, {useCallback, useEffect, useState} from 'react';
import {Configuration} from 'models/configuration';
import {Equipment} from 'models/equipment';
import {ServiceRepository} from 'services/serviceRepository';
import {Navigation} from 'utils/routes';
import {useTranslation} from 'react-i18next';
import {generatePath} from 'react-router-dom';
import {URLs} from 'utils/urls';
import QueryFilter from 'models/api/queryFilter';

import {ButtonIconProps} from 'components/Shared/Button/ButtonProps';
import ButtonIcon from 'components/Shared/Button/ButtonIcon';

import './ConfigurationBox.scss';
import Spinner from 'components/Shared/Spinner';

interface ConfigurationBoxProps {
  title: string,
  readonly: boolean,
  leftButton?: ButtonIconProps,
  rightButton?: ButtonIconProps,
  configuration: Configuration.DTO
}

const ConfigurationBox: React.FC<ConfigurationBoxProps> = (props: ConfigurationBoxProps) => {
  const {t} = useTranslation();
  const [equipments, setEquipments] = useState<Equipment.DTO[]>();
  const equipSvc = ServiceRepository.getInstance().equipmentSvc;

  useEffect(() => {
    let keys = props.configuration.equipmentKeys.join(',');
    if (keys.length !== 0) {
      let filters = new QueryFilter({key: keys});
      equipSvc.listEquipments(filters)
        .then(equipments => setEquipments(equipments.data));
    } else {
      setEquipments([]);
    }
  }, [equipSvc, props.configuration.equipmentKeys]);

  const display3dView = useCallback(() => {
    let url = generatePath(URLs.API.CONFIGURATION, {configurationId: props.configuration.id});
    Navigation.navigate(url, true);
  }, [props.configuration.id]);

  return <div className={'config-box'}>
    <div className={'config-box-header'}>
      <div className={'config-box-header-label'}>{props.readonly ? `${props.title} (${t('readonly')})` : props.title}</div>
      <div>
        {props.leftButton && <ButtonIcon label={props.leftButton?.label} onClick={props.leftButton.onClick}
                                         iconUrl={props.leftButton.iconUrl}/>}
        {props.rightButton && <ButtonIcon label={props.rightButton?.label} onClick={props.rightButton.onClick}
                                          iconUrl={props.rightButton.iconUrl}/>}
        <ButtonIcon label={'3D'} onClick={display3dView} iconUrl={'/assets/img/icon_3d_view'}/>
      </div>
    </div>

    <div className={'config-box-content'}>
      {!equipments && <div className={'fill-parent'}><Spinner inlined/></div>}
      {equipments && equipments.length === 0 && <div>{t('roomEmptyConfiguration')}</div>
      }
      {equipments && equipments.map((equipment, id) => {
        return <div key={equipment.key} className={'config-box-content-item-wrapper'}>
          {id !== 0 && <div className="config-box-content-item-separator">+</div>}
          <div className={'config-box-content-item'}>{t(equipment.name)}</div>
        </div>;
      })}

      {/*<div className={'config-box-3d-view'}>*/}
      {/*  */}
      {/*</div>*/}
    </div>
  </div>;
};

export default ConfigurationBox;