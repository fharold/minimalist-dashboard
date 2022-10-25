import React, {useEffect, useState} from "react";
import {ServiceRepository} from "services/serviceRepository";
import {User} from "models/user";
import {toast} from "react-toastify";
import Axios, {AxiosError} from "axios";
import {FormCompiler} from "../../../utils/Form/FormCompiler";
import {AddCustomerPayload} from "../../../services/userService";
import TextInput from "../../Shared/TextInput";
import DateInput from "../../Shared/DateInput";
import {Navigation} from "../../../utils/routes";
import {headerStore} from "stores/headerStore";
import {useTranslation} from "react-i18next";
import SearchableSelect from "../../Shared/SearchableSelect";

const CustomerCreate: React.FC = () => {
  const userService = ServiceRepository.getInstance().userSvc;
  const setHeader = headerStore(state => state.setHeaderProps);
  const {t} = useTranslation();

  setHeader({
    title: "createCustomerTitle",
    subtitle: `createCustomerSubtitle`,
    backEnabled: true
  });

  const compiler = new FormCompiler();
  const usrSvc = ServiceRepository.getInstance().userSvc;

  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    usrSvc.getCompanies().then(setCompanies);
  }, [usrSvc])


  const handleCustomerCreation = async (payload: AddCustomerPayload): Promise<User.DTO> => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await userService.addCustomer(payload));
      } catch (e) {
        let message = t('createCustomerFailed');

        if (Axios.isAxiosError(e)) {
          if ((e as AxiosError).response?.status === 409) {
            message = t('createCustomerFailedDuplicate');
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

    const payload: AddCustomerPayload = compiler.compile([
      "firstName", "lastName", "company", "hatchery", "email", "phone", "addressLine1",
      "addressLine2", "zipCode", "city", "country", "expireAt"]);
    payload.role = User.Role.STANDARD;
    payload.status = User.Status.ENABLED;

    //if current user is a sales rep, we assume that customer should be assigned to current user.
    if (userService.currentUser?.role === User.Role.SALES_REP) {
      payload.referentUserId = userService.currentUser?.id;
    }

    await handleCustomerCreation(payload);
    toast(t('createCustomerConfirmation'));
    Navigation.navigate('/customers', true);
  }

  return <table className={"form"}>
    <tbody>
    <tr>
      <td/>
      <td>
        <div className={'section-title'}>{t('createCustomerDetailsLabel')}</div>
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('createCustomerFirstNameLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"firstName"}
          t={t}
          errorMsg={"mandatoryField"}
          required={true}
          placeholder={"createCustomerFirstNamePlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('createCustomerLastNameLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"lastName"}
          errorMsg={"mandatoryField"}
          required={true}
          placeholder={"createCustomerLastNamePlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('createCustomerCompanyLabel')}</label></td>
      <td>
        <SearchableSelect
          ref={ref => ref && compiler.register(ref)}
          id={"company"}
          t={t}
          required={true}
          placeholder={"createCustomerCompanyPlaceholder"}
          validation={(v) => !!v && v?.length > 0}
          values={companies}/>
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('createCustomerHatcheryLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"hatchery"}
          required={true}
          errorMsg={"mandatoryField"}
          t={t}
          placeholder={"createCustomerHatcheryPlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td/>
      <td>
        <div className={'section-title'}>{t('createCustomerContactLabel')}</div>
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('createCustomerEmailLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"email"}
          errorMsg={"invalidMail"}
          required={true}
          t={t}
          placeholder={"createCustomerEmailPlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('createCustomerPhoneLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"phone"}
          errorMsg={"mandatoryField"}
          required={true}
          placeholder={"createCustomerPhonePlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('createCustomerAddressSection')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"addressLine1"}
          errorMsg={"mandatoryField"}
          required={true}
          t={t}
          placeholder={"createCustomerAddressLine1Placeholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td/>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"addressLine2"}
          errorMsg={"mandatoryField"}
          required={false}
          placeholder={"createCustomerAddressLine2Placeholder"}
          validation={(v) => true}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('createCustomerZipCodeLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"zipCode"}
          required={true}
          errorMsg={"mandatoryField"}
          placeholder={"createCustomerZipCodePlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('createCustomerCityLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"city"}
          errorMsg={"mandatoryField"}
          required={true}
          t={t}
          placeholder={"createCustomerCityPlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('createCustomerCountryLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"country"}
          errorMsg={"mandatoryField"}
          required={true}
          t={t}
          placeholder={"createCustomerCountryPlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>


    <tr style={{height: '1rem'}}/>
    <tr>
      <td/>
      <td>
        <div className={'section-title'}>{t('createCustomerAccessStatusLabel')}</div>
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('createCustomerAccessStatusAllowedUntil')}</label></td>
      <td>
        <DateInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"expireAt"}
          required={true}
          placeholder={"date picker"}
          validation={(v) => true}
        />
      </td>
      <td/>
    </tr>

    <tr className={"table-separator"}/>
    <tr>
      <td/>
      <td>
        <p className={"button light"} onClick={() => submitForm()}>{t('createCustomerSubmitButton')}</p>
      </td>
      <td/>
    </tr>
    </tbody>
  </table>
    ;
}

export default CustomerCreate;