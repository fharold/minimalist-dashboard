import React from "react";
import {ServiceRepository} from "services/serviceRepository";
import {User} from "models/user";
import {toast} from "react-toastify";
import Axios, {AxiosError} from "axios";
import {FormCompiler} from "../../../utils/Form/FormCompiler";
import {AddSalesPayload} from "../../../services/userService";
import TextInput from "../../Shared/TextInput";
import CheckboxInput from "../../Shared/CheckboxInput";
import {Navigation} from "../../../utils/routes";
import {headerStore} from "stores/headerStore";
import {useTranslation} from "react-i18next";

const SalesCreate: React.FC = () => {
  const userService = ServiceRepository.getInstance().userSvc;
  const setHeader = headerStore(state => state.setHeaderProps);
  const {t} = useTranslation();

  setHeader({
    title: t('salesCreateTitle'),
    subtitle: t(`salesCreateSubtitle`),
    backEnabled: true
  });

  const compiler = new FormCompiler();

  const handleSalesCreation = async (payload: AddSalesPayload): Promise<User.DTO> => {
    return new Promise(async (resolve, reject) => {
      try {
        let sales = await userService.addSales(payload);

        resolve(await userService.editUser(sales.id, {
          role: User.Role.SALES_REP
        }));
      } catch (e) {
        let message = t('salesCreateFailed');

        if (Axios.isAxiosError(e)) {
          if ((e as AxiosError).response?.status === 409) {
            message = t('salesCreateFailedDuplicate');
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
      "firstName", "lastName", "status", "phone", "email"]);
    payload.status === true ? payload.status = User.Status.ENABLED : payload.status = User.Status.DISABLED;
    payload.role = User.Role.SALES_REP;

    await handleSalesCreation(payload);
    toast(t('salesCreateConfirmation'));
    Navigation.navigate('/sales', true);
  }

  return <table className={"form"}>
    <tbody>
    <tr>
      <td/>
      <td><div className={'section-title'}>{t('salesCreateDetailsLabel')}</div></td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('salesCreateFirstNameLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"firstName"}
          required={true}
          errorMsg={"mandatoryField"}
          placeholder={"salesCreateFirstNamePlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('salesCreateLastNameLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"lastName"}
          required={true}
          errorMsg={"mandatoryField"}
          placeholder={"salesCreateLastNamePlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td/>
      <td><div className={'section-title'}>{t('salesCreateContactLabel')}</div></td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('salesCreateEmailLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"email"}
          required={true}
          errorMsg={"mandatoryField"}
          placeholder={"salesCreateEmailPlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('salesCreatePhoneLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"phone"}
          t={t}
          required={true}
          errorMsg={"mandatoryField"}
          placeholder={"salesCreatePhonePlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr style={{height: '1rem'}}/>
    <tr>
      <td/>
      <td><div className={'section-title'}>{t('salesCreateAccessStatusLabel')}</div></td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('salesCreateAccessStatusAllow')}</label></td>
      <td className={"visible-field"}>
        <CheckboxInput label={""}
                       t={t}
                       required={true}
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
        <p className={"button light"} onClick={() => submitForm()}>{t('salesCreateFormSubmit')}</p>
      </td>
      <td/>
    </tr>
    </tbody>
  </table>;
}

export default SalesCreate;