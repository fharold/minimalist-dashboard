import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';

import {headerStore} from 'stores/headerStore';
import {ServiceRepository} from 'services/serviceRepository';
import {User} from 'models/user';
import {Navigation} from 'utils/routes';
import {Configuration} from 'models/configuration';

import 'components/Shared/List/List.scss';
import './AccessSendPage.scss';
import {useTranslation} from "react-i18next";
import {FormCompiler} from "../../../utils/Form/FormCompiler";
import MultiLineTextInput from "../../Shared/MutiLineTextInput";
import Status = User.Status;
import Role = User.Role;
import ConfigurationAdapter from "../../../adapter/ConfigurationAdapter";
import ConfigurationProvider from "../../../adapter/ConfigurationProvider";
import Dialog from "../../Shared/Dialog";
import List from "../../Shared/List/List";

export class AccessSendDTO {
  constructor(message: string) {
    this.message = message;
  }

  message: string;
}

const AccessSendPage: React.FC = (props) => {
  const _isMounted = useRef<boolean>(true);
  const usrSvc = ServiceRepository.getInstance().userSvc;
  const cfgSvc = ServiceRepository.getInstance().cfgSvc;
  const {userId} = useParams();
  const {t} = useTranslation();
  const compiler = new FormCompiler();
  const [deleteDialogCfg, setDeleteDialogCfg] = useState<Configuration.DTO | undefined>(undefined);
  const [configurationsProvider] = useState(
    new ConfigurationProvider(ServiceRepository.getInstance().cfgSvc, userId));
  const [busy, setBusy] = useState<boolean>(false);

  const [relatedUser, setRelatedUser] = useState<User.DTO>();
  const adapter = useMemo(() => new ConfigurationAdapter(t, configurationsProvider, {
    rowSelected(obj: Configuration.DTO) {
      Navigation.navigate(`/configurations/edit/${obj.id}`, true);
    },

    onRemoveClick(obj: Configuration.DTO) {
      setDeleteDialogCfg(obj);
    },

    onEditClick(obj: Configuration.DTO) {
      Navigation.navigate(`/configurations/edit/${obj.id}`, true);
    }
  }), [configurationsProvider]);

  useEffect(() => {
    if (!userId) return Navigation.navigate('/', false);

    usrSvc.getUser(userId).then(user => setRelatedUser(user));

    // UNMOUNT
    return () => {
      _isMounted.current = false;
    };
  }, [userId, usrSvc]);

  const setHeader = headerStore(state => state.setHeaderProps);
  setHeader({
    title: User.prettyName(relatedUser),
    subtitle: t('accessSendPageSubtitle'),
    backEnabled: true
  });

  const removeCfg = async () => {
    if (!deleteDialogCfg?.id) return;
    setDeleteDialogCfg(undefined);
    toast(t('customerDetailsRemovingConfiguration'));
    await cfgSvc.removeConfiguration(deleteDialogCfg?.id)
    toast(t('customerDetailsConfigurationRemoved'));
    configurationsProvider.load();
  }

  const sendAccess = async () => {
    if (!relatedUser) return;
    if (busy) return;

    const payload: Partial<AccessSendDTO> = compiler.compile(["message"]);

    setBusy(true);
    //first, enable user if he is not enabled.
    if (relatedUser.status !== User.Status.ENABLED) {
      let editedUser = await usrSvc.editUser(relatedUser.id, {
        status: Status.ENABLED
      });

      setRelatedUser(editedUser);
    }

    try {
      await usrSvc.sendAccess(relatedUser.id, payload);
      toast(t('accessSendPageConfirmation', {
        autoClose: 10000,
        type: "info"
      }));
      setBusy(false);
      Navigation.goBack();
    } catch (e) {
      toast(t('accessSendFailed', {
        autoClose: 10000,
        type: "error"
      }));
      setBusy(false);
    }
  }

  return (
    <div className={"access-send-page"}>
      <table className={'form'}>
        <tbody>
        {
          relatedUser?.role === Role.STANDARD && <tr>
            <td/>
            <td>
              <div className={"cfg-list"}>
                <List adapter={adapter} dataProvider={configurationsProvider}/>
              </div>
            </td>
            <td/>
          </tr>
        }
        <tr>
          <td/>
          <div className={'section-title'}>{t('accessSendPageMessageLabel')}</div>
          <td/>
        </tr>
        <tr>
          <td/>
          <td><MultiLineTextInput placeholder={t('accessSendPageMessagePlaceholder')}
                                  ref={ref => ref && compiler.register(ref)}
                                  required={false}
                                  id={'message'}
                                  t={t}/></td>
          <td/>
        </tr>
        <tr/>
        <tr>
          <td/>
          <div className={"form-submit"}>
            <span className={"button light"} onClick={() => sendAccess()}>{t('accessSendButton')}</span><span
            className={"button secondary"} onClick={() => Navigation.goBack()}>{t('cancel')}</span>
          </div>
          <td/>
        </tr>
        </tbody>
      </table>
      <Dialog
        visible={!!deleteDialogCfg}
        dismiss={() => setDeleteDialogCfg(undefined)}
        title={t('customerDetailsRemoveDialogTitle', {cfgName: deleteDialogCfg?.name})}
        subtitle={t('customerDetailsRemoveDialogSubtitle')}
        positiveButton={{label: t('customerDetailsRemoveDialogConfirm'), onClick: removeCfg}}/>
    </div>
  );
};

export default AccessSendPage;