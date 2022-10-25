import React, {useCallback, useEffect, useRef, useState} from 'react';

import 'components/Shared/List/List.scss';
import {headerStore} from 'stores';
import {ServiceRepository} from 'services/serviceRepository';
import {FormCompiler} from 'utils/Form/FormCompiler';
import TextInput from 'components/Shared/TextInput';
import {toast} from 'react-toastify';
import {Navigation} from 'utils/routes';
import Axios, {AxiosError} from 'axios';
import {generatePath, useParams} from 'react-router-dom';
import {Configuration} from 'models/configuration';
import ConfigElemInput from '../../Shared/ConfigElemInput';
import {CloneAndModifyCfgDTO} from 'services/configurationService';
import {User} from 'models/user';
import ButtonIcon from 'components/Shared/Button/ButtonIcon';
import {URLs} from 'utils/urls';
import Role = User.Role;
import {useTranslation} from "react-i18next";

export interface ConfigurationEditProps {
  customerId: string | null;
  cfgToCloneId: string | null;
}

const ConfigurationEdit: React.FC<ConfigurationEditProps> = (props: ConfigurationEditProps) => {
  const _isMounted = useRef<boolean>(true);
  const compiler = new FormCompiler();
  const {configId} = useParams();
  const [customer, setCustomer] = useState<User.DTO>();
  const cfgSvc = ServiceRepository.getInstance().cfgSvc;
  const userSvc = ServiceRepository.getInstance().userSvc;
  const [config, setConfig] = useState<Configuration.DTO>();
  const {t} = useTranslation();

  useEffect(() => {
    if (props.customerId) {
      userSvc.getUser(props.customerId).then(value => setCustomer(value));
    } else if (config?.relatedCustomer) {
      userSvc.getUser(config.relatedCustomer).then(value => setCustomer(value));
    } else {
      setCustomer(userSvc.currentUser)
    }

  }, [config?.relatedCustomer, props.customerId, userSvc]);

  useEffect(() => {
    if (!configId) return;

    cfgSvc.getConfiguration(configId).then(value => {
      setConfig(value);
    }).catch(e => {
      console.error(e);
    });
  }, [cfgSvc, configId]);

  useEffect(() => {
    // UNMOUNT
    return () => {
      _isMounted.current = false;
    };
  }, []);


  const setHeader = headerStore(state => state.setHeaderProps);
  setHeader({
    title: [Role.STANDARD, Role.SALES_REP].includes(customer?.role || Role.STANDARD) ? User.prettyName(customer) : "Edit configuration template",
    subtitle: config?.room,
    backEnabled: true
  });


  const handleConfigClone = async (payload: CloneAndModifyCfgDTO): Promise<Configuration.DTO> => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await cfgSvc.cloneAndModifyConfiguration(payload));
      } catch (e) {
        let message = t('configurationEditFailed');

        if (Axios.isAxiosError(e)) {
          if ((e as AxiosError).response?.status === 409) {
            message = t('configurationEditFailedDuplicate');
          }
        }
        toast(message, {
          autoClose: 10000,
          type: 'error'
        });
        reject();
      }
    });
  };

  const handleConfigEdit = async (payload: Partial<Configuration.DTO>): Promise<Configuration.DTO> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!payload.id) return reject('missing id');
        resolve(await cfgSvc.editConfiguration(payload.id, payload));
      } catch (e) {
        let message = t('configurationEditFailed');

        if (Axios.isAxiosError(e)) {
          if ((e as AxiosError).response?.status === 409) {
            message = t('configurationEditFailedDuplicate');
          }
        }
        toast(message, {
          autoClose: 10000,
          type: 'error'
        });
        reject();
      }
    });
  };

  const display3dView = useCallback(() => {
    let url = generatePath(URLs.API.CONFIGURATION, {configurationId: configId});
    Navigation.navigate(url, true);
  }, [configId]);

  const submitForm = async () => {
    if (!compiler.checkFormValidity()) {
      console.error('invalid form');
      return;
    }

    const payload: CloneAndModifyCfgDTO = compiler.compile([
      'name', 'equipmentKeys']);

    try {
      if (!!props.cfgToCloneId && !!props?.customerId) {
        //if cfgtocloneid is defined, we are cloning a cfg.
        payload.targetRelatedCustomer = props?.customerId;
        payload.cfgToCloneId = props?.cfgToCloneId;
        await handleConfigClone(payload);
      } else {
        //else, it seems that we are only editing this cfg.
        await handleConfigEdit({
          id: config?.id,
          equipmentKeys: payload.equipmentKeys,
          name: payload.name
        });
      }

      toast(t('configurationEdited'));
      Navigation.goBack();
    } catch (e) {
      console.error(e);
      toast(t('configurationEditFailed'), {
        autoClose: 10000,
        type: 'error'
      });
    }
  };

  return <table className={'form'}>
    <tbody>
    <tr>
      <td/>
      <td><div className={'section-title'}>{t('configurationDetails')}</div></td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('configurationName')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={'name'}
          t={t}
          required={true}
          errorMsg={"mandatoryField"}
          defaultValue={config?.name}
          placeholder={'configurationName'}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr style={{height: '1rem'}}/>
    <tr>
      <td/>
      <td><div className={'section-title'}>{t('configurationElements')}</div></td>
      <td/>
    </tr>
    <tr>
      <td/>
      <td>
        {config && <ConfigElemInput
          ref={ref => ref && compiler.register(ref)}
          id={'equipmentKeys'}
          required={true}
          t={t}
          label={''}
          room={config?.room}
          defaultValue={config?.equipmentKeys}/>}
      </td>
      <td/>
    </tr>
    <tr>
      <td/>
      <td>
        <ButtonIcon label={'3D'} onClick={display3dView} iconUrl={'/assets/img/icon_3d_view'}/>
      </td>
      <td/>
    </tr>
    <tr style={{height: '1rem'}}/>
    <tr>
      <td/>
      <td>
        <p className={'button light'}
          onClick={() => submitForm()}>{t('save')}</p>
      </td>
      <td/>
    </tr>
    </tbody>
  </table>;
};

export default ConfigurationEdit;