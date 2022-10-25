import React, {useEffect, useState} from "react";
import {ServiceRepository} from "services/serviceRepository";
import {User} from "models/user";
import {toast} from "react-toastify";
import Axios, {AxiosError} from "axios";
import {FormCompiler} from "../../../utils/Form/FormCompiler";
import {AddSalesPayload} from "../../../services/userService";
import TextInput from "../../Shared/TextInput";
import CheckboxInput from "../../Shared/CheckboxInput";
import {Navigation} from "../../../utils/routes";
import {useParams} from "react-router-dom";
import {headerStore} from "stores/headerStore";
import {useTranslation} from "react-i18next";

const SalesEdit: React.FC = () => {
  const userService = ServiceRepository.getInstance().userSvc;
  const {userId} = useParams();
  const [user, setUser] = useState<User.DTO | undefined>();
  const {t} = useTranslation();

  const setHeader = headerStore(state => state.setHeaderProps);

  setHeader({
    title: User.prettyName(user),
    subtitle: `salesEditSubtitle`,
    backEnabled: true
  });

  const compiler = new FormCompiler();

  useEffect(() => {
    if (!userId) return Navigation.navigate('/sales', true);
    userService.getUser(userId).then((user => {
      setUser(user)
    }));
  }, [userId, userService])

  const handleSalesEdition = async (payload: AddSalesPayload): Promise<User.DTO> => {
    console.log("payload", payload);
    return new Promise(async (resolve, reject) => {
      if (!user) return reject();
      try {
        resolve(await userService.editUser(user.id, payload));
      } catch (e) {
        let message = t('salesEditFailed');

        if (Axios.isAxiosError(e)) {
          if ((e as AxiosError).response?.status === 409) {
            message = t('salesEditFailedDuplicate');
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

    const payload: AddSalesPayload = compiler.compile([
      "firstName", "lastName", "phone", "status", "email"]);
    payload.status === true ? payload.status = User.Status.ENABLED : payload.status = User.Status.DISABLED;
    payload.role = User.Role.SALES_REP;
    payload.profile = {
      phone: payload.phone
    }

    await handleSalesEdition(payload);
    toast(t('salesEditConfirmation'));
    Navigation.navigate('/sales', true);
  }

  return <table className={"form"}>
    <tbody>
    <tr>
      <td/>
      <td><div className={'section-title'}>{t('salesEditDetailsLabel')}</div></td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('salesEditFirstNameLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"firstName"}
          required={true}
          defaultValue={user?.firstName}
          placeholder={"salesEditFirstNamePlaceholder"}
          errorMsg={"mandatoryField"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('salesEditLastNameLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"lastName"}
          required={true}
          placeholder={"salesEditLastNamePlaceholder"}
          defaultValue={user?.lastName}
          errorMsg={"mandatoryField"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td/>
      <td><div className={'section-title'}>{t('salesEditContactLabel')}</div></td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('salesEditEmailLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"email"}
          required={true}
          defaultValue={user?.email}
          errorMsg={"invalidMail"}
          placeholder={"salesEditEmailPlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('salesEditPhoneLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"phone"}
          defaultValue={user?.profile?.phone}
          required={true}
          errorMsg={"mandatoryField"}
          placeholder={"salesEditPhonePlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr style={{height: '1rem'}}/>
    <tr>
      <td/>
      <td><div className={'section-title'}>{t('salesEditAccessStatusLabel')}</div></td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('salesEditAccessStatusAllow')}</label></td>
      <td className={"visible-field"}>
        <CheckboxInput label={""}
                       t={t}
                       required={true}
                       defaultValue={user?.status === User.Status.ENABLED}
                       id={"status"}
                       ref={ref => ref && compiler.register(ref)}
        />
      </td>
      <td/>
    </tr>

    <tr className={"table-separator"}/>
    <tr>
      <td/>
      <td>
        <p className={"button light"} onClick={() => submitForm()}>{t('salesEditFormSubmit')}</p>
      </td>
      <td/>
    </tr>
    </tbody>
  </table>;
}

export default SalesEdit;