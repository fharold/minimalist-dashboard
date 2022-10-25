import React, {useEffect, useRef, useState} from 'react';

import 'components/Shared/List/List.scss';
import {headerStore} from 'stores';
import {ServiceRepository} from 'services/serviceRepository';
import {FormCompiler} from 'utils/Form/FormCompiler';
import TextInput from 'components/Shared/TextInput';
import {toast} from 'react-toastify';
import {Navigation} from 'utils/routes';
import Axios, {AxiosError} from 'axios';
import {Configuration, Room} from 'models/configuration';
import ConfigElemInput from '../../Shared/ConfigElemInput';
import {CreateCfgDTO} from 'services/configurationService';
import {DateUtils} from "../../../utils/DateUtils";
import {useTranslation} from "react-i18next";

interface AdminConfigurationCreateProps {
  room: string | null
}

const AdminConfigurationCreate: React.FC<AdminConfigurationCreateProps> = (props: AdminConfigurationCreateProps) => {
  const _isMounted = useRef<boolean>(true);
  const compiler = new FormCompiler();
  const cfgSvc = ServiceRepository.getInstance().cfgSvc;
  const equipSvc = ServiceRepository.getInstance().equipmentSvc;
  const [equipKeys, setEquipKeys] = useState<string[]>([]);
  const {t} = useTranslation();

  useEffect(() => {
    if (!props.room) return;

    equipSvc.listEquipments().then(res => {
      setEquipKeys(res.data.map(equip => equip.key));
    }).catch(e => {
      console.error(e);
    });
  }, [cfgSvc, equipSvc, props.room]);

  useEffect(() => {
    // UNMOUNT
    return () => {
      _isMounted.current = false;
    };
  }, []);


  const setHeader = headerStore(state => state.setHeaderProps);
  setHeader({
    title: 'configurationCreate',
    subtitle: props.room || undefined,
    backEnabled: true
  });


  const handleConfigCreate = async (payload: CreateCfgDTO): Promise<Configuration.DTO> => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await cfgSvc.createConfiguration(payload));
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

  const submitForm = async () => {
    if (!compiler.checkFormValidity()) {
      console.error('invalid form');
      return;
    }

    if (!props.room) return;

    const payload: CreateCfgDTO = compiler.compile([
      'name', 'equipmentKeys']);
    payload.room = props.room;
    payload.crateKey = "crateKey";
    payload.crateContentKey = "crateContentKey";
    payload.key = props.room + DateUtils.now();
    payload.readonly = true;
    payload.visibility = true;

    try {
      await handleConfigCreate(payload);

      toast(t('configurationCreated'));
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
      <td>
        <div className={'section-title'}>{t('configurationDetails')}</div>
      </td>
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
          placeholder={'configurationName'}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr style={{height: '1rem'}}/>
    <tr>
      <td/>
      <td>
        <div className={'section-title'}>{t('configurationElements')}</div>
      </td>
      <td/>
    </tr>
    <tr>
      <td/>
      <td><ConfigElemInput
        ref={ref => ref && compiler.register(ref)}
        t={t}
        id={'equipmentKeys'}
        required={true}
        label={''}
        room={props.room as Room}
        defaultValue={equipKeys}/>
      </td>
      <td/>
    </tr>
    <tr style={{height: '1rem'}}/>
    <tr>
      <td/>
      <td>
        <p className={'button light'}
           onClick={() => submitForm()}>{t('configurationCreate')}</p>
      </td>
      <td/>
    </tr>
    </tbody>
  </table>;
};

export default AdminConfigurationCreate;