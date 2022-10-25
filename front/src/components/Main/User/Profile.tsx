import React, {useEffect, useMemo, useState} from "react";
import {ServiceRepository} from "services/serviceRepository";
import {User} from "models/user";
import {toast} from "react-toastify";
import Axios, {AxiosError} from "axios";
import {FormCompiler} from "../../../utils/Form/FormCompiler";
import {EditPasswordPayload, EditProfilePayload} from "../../../services/userService";
import TextInput from "../../Shared/TextInput";
import {headerStore} from "stores/headerStore";
import {isPasswordStrongEnough} from "../../../utils/passwordUtils";
import {useTranslation} from "react-i18next";

const Profile: React.FC = () => {
  const userService = ServiceRepository.getInstance().userSvc;
  const [user, setUser] = useState<User.DTO | undefined>(userService.currentUser);
  const [userReferent, setUserReferent] = useState<User.DTO | undefined>();
  const setHeader = headerStore(state => state.setHeaderProps);
  const {t} = useTranslation();

  useEffect(() => {
    console.error("use effect referent", user?.referentUserId);
    if (!user?.referentUserId) return;
    userService.getUser(user.referentUserId).then(setUserReferent)
  }, [user, userService])

  setHeader({
    title: User.prettyName(user),
    subtitle: `profileSubtitle`,
    backEnabled: true
  });

  const compiler = new FormCompiler();

  const userSvcListener = useMemo(() => {
    return {
      onSubjectUpdate(sub?: User.DTO) {
        setUser(sub)
      }
    }
  }, []);

  userService.addListener(userSvcListener);

  useEffect(() => {
    return userService.removeListener(userSvcListener);
  }, [userService, userSvcListener])

  const handleProfileEdition = async (payload: EditProfilePayload): Promise<User.DTO> => {
    return new Promise(async (resolve, reject) => {
      if (!user) return reject();
      try {
        resolve(await userService.editUser(user.id, payload));
      } catch (e) {
        let message = t('profileSaveFailed');

        if (Axios.isAxiosError(e)) {
          if ((e as AxiosError).response?.status === 409) {
            message = t('profileSaveFailedDuplicate')
          }
        }
        toast(message, {
          autoClose: 10000,
          type: "error"
        });
        reject();
      }
    })
  }

  const handlePasswordEdition = async (payload: EditPasswordPayload): Promise<User.DTO> => {
    return new Promise(async (resolve, reject) => {
      if (!user) return reject();
      try {
        resolve(await userService.editPassword(user.id, payload.password));
      } catch (e) {
        let message = t('profileSaveFailed');

        if (Axios.isAxiosError(e)) {
          if ((e as AxiosError).response?.status === 409) {
            message = t('profileSaveFailedDuplicate')
          }
        }
        toast(message, {
          autoClose: 10000,
          type: "error"
        });
        reject();
      }
    })
  }

  const submitForm = async () => {
    if (!compiler.checkFormValidity()) return;

    const profilePayload: EditProfilePayload = compiler.compile(["firstName", "lastName"]);
    const passwordPayload: EditPasswordPayload = compiler.compile(["password"]);

    let user = await handleProfileEdition(profilePayload);
    if (user) setUser(user);
    if (passwordPayload.password && isPasswordStrongEnough(passwordPayload.password)) await handlePasswordEdition(passwordPayload);
    toast(t('profileSaveSuccess'));
  }

  return <table className={"form"}>
    <tbody>
    <tr>
      <td><label>{t('profileFirstNameLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"firstName"}
          errorMsg={"mandatoryField"}
          required={true}
          defaultValue={user?.firstName}
          placeholder={"profileFirstNamePlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('profileLastNameLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"lastName"}
          errorMsg={"mandatoryField"}
          required={true}
          placeholder={"profileLastNamePlaceholder"}
          defaultValue={user?.lastName}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('profileEmailLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"email"}
          required={true}
          errorMsg={"invalidMail"}
          readonly={true}
          defaultValue={user?.email}
          placeholder={"profileEmailPlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('profilePasswordLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"password"}
          required={true}
          readonly={false}
          type={"password"}
          placeholder={"profilePasswordPlaceholder"}
          errorMsg={'passwordTooWeak'}
          validation={(v) => {
            if (!v) return true;
            return isPasswordStrongEnough(v);
          }}/></td>
      <td/>
    </tr>
    {user?.role === User.Role.STANDARD && <tr>
      <td><label>{t('profileMySalesRep')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"sales_rep"}
          required={false}
          readonly={true}
          placeholder={""}
          errorMsg={"mandatoryField"}
          defaultValue={User.prettyName(userReferent)}
        />
      </td>
      <td/>
    </tr>}
    <tr className={"table-separator"}/>
    <tr>
      <td/>
      <td>
        <p className={"button light"} onClick={() => submitForm()}>{t('profileSave')}</p>
      </td>
      <td/>
    </tr>
    </tbody>
  </table>;
}

export default Profile;