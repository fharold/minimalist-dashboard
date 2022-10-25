import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';

import {headerStore} from 'stores/headerStore';
import {ServiceRepository} from 'services/serviceRepository';
import {User} from 'models/user';
import {Navigation} from 'utils/routes';
import {Configuration} from 'models/configuration';
import ConfigurationBox from './ConfigurationBox';
import {ButtonIconProps} from 'components/Shared/Button/ButtonProps';

import 'components/Shared/List/List.scss';
import './RoomDetails.scss';
import {useTranslation} from "react-i18next";

export interface RoomDetailsProps {
  customerId: string | null
}

const RoomDetails: React.FC<RoomDetailsProps> = (props) => {
  const _isMounted = useRef<boolean>(true);
  const usrSvc = ServiceRepository.getInstance().userSvc;
  const cfgSvc = ServiceRepository.getInstance().cfgSvc;
  const {name} = useParams();
  const {t} = useTranslation();

  const [customer, setCustomer] = useState<User.DTO>();
  const [configs, setConfigs] = useState<Configuration.DTO[]>();

  useEffect(() => {
    if (!name) return Navigation.navigate('/', false);

    usrSvc.getUser(props.customerId ? props.customerId : usrSvc.currentUser?.id || '').then(user => setCustomer(user));

    // UNMOUNT
    return () => {
      _isMounted.current = false;
    };
  }, [props.customerId, name, usrSvc]);

  useEffect(() => {
    if (!name) return;
    console.log(name);

    cfgSvc.getConfigurations(name, true).then((cfgs) => {
      setConfigs(cfgs.data)
    });
  }, [cfgSvc, name])

  const setHeader = headerStore(state => state.setHeaderProps);
  setHeader({
    title: User.prettyName(customer),
    subtitle: t(name || ''),
    backEnabled: true
  });

  const deleteCfg = async (cfgId: string) => {
    let cfgSvc = ServiceRepository.getInstance().cfgSvc;
    toast(t('roomDetailsRemovingCfg'));
    await cfgSvc.removeConfiguration(cfgId);
    toast(t('roomDetailsCfgRemoved'));

    if (!name) return;

    cfgSvc.getConfigurations(name, true).then((cfgs) => {
      setConfigs(cfgs.data)
    });
  }

  const handleAddToCustomersList = (cfgId: string) => {
    let cfgSvc = ServiceRepository.getInstance().cfgSvc;

    if (!customer?.id) return;

    toast(t('roomDetailsAddingCfg'));
    cfgSvc.cloneConfiguration({cfgToCloneId: cfgId, targetRelatedCustomer: customer?.id}).then(() => {
      toast(t('roomDetailsCfgAdded'));
      Navigation.navigate(`/customers/${props.customerId}`, true);
    }).catch(() => {
      toast(t('roomDetailsFailedToAddCfg'), {
        autoClose: 10000,
        type: "error"
      });
    })
  }

  return (
    <div className={"room-details-page"}>
      <div className={'centered-button'}>
        <div className={'button light'} onClick={() =>
          Navigation.navigate(`/configurations/create?room=${name}`, true)}>
          {t('roomsConfigurationListCreateBtn')}
        </div>
      </div>
      <div className={'section-title'}>{t('roomsConfigurationListEditSection')}</div>
      {
        configs?.map(cfg => {
          const customerId = props.customerId;
          const leftProps: ButtonIconProps = {label: '', iconUrl: '', onClick: () => void 0};
          const rightProps: ButtonIconProps = {label: '', iconUrl: '', onClick: () => void 0};

          if (!!customerId) {
            leftProps.label = t('roomDetailsAddToCustomersList');
            leftProps.iconUrl = '/assets/img/add_to_cust_list_icon';
            leftProps.onClick = () => handleAddToCustomersList(cfg.id);
            rightProps.label = t('edit');
            rightProps.iconUrl = '/assets/img/edit_icon';
            rightProps.onClick = () => Navigation.navigate(`/configurations/edit/${cfg.id}?cfgToCloneId=${cfg.id}`, true); // TODO use generatePath()
          } else {
            leftProps.label = t('edit');
            leftProps.iconUrl = '/assets/img/edit_icon';
            leftProps.onClick = () => Navigation.navigate(`/configurations/edit/${cfg.id}?customerId=${customer?.id}&cfgToCloneId=${cfg.id}`, true); // TODO use generatePath()
            rightProps.label = t('delete');
            rightProps.iconUrl = '/assets/img/delete_icon';
            rightProps.onClick = () => deleteCfg(cfg.id);
          }

          return <ConfigurationBox
            key={cfg.key}
            readonly={cfg.readonly}
            title={cfg.name}
            configuration={cfg}
            leftButton={leftProps}
            rightButton={rightProps}
          />
        })
      }
    </div>
  );
};

export default RoomDetails;