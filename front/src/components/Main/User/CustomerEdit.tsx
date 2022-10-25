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
import {useParams} from "react-router-dom";
import CustomerProfile = User.CustomerProfile;
import {headerStore} from "stores/headerStore";
import {useTranslation} from "react-i18next";
import SearchableSelect from "../../Shared/SearchableSelect";

const CustomerEdit: React.FC = () => {
  const userService = ServiceRepository.getInstance().userSvc;
  const {userId} = useParams();
  const [user, setUser] = useState<User.DTO | undefined>();
  const [companies, setCompanies] = useState<string[]>([]);
  const setHeader = headerStore(state => state.setHeaderProps);
  const {t} = useTranslation();

  setHeader({
    title: User.prettyName(user),
    subtitle: `editCustomerSubtitle`,
    backEnabled: true
  });

  const compiler = new FormCompiler();

  useEffect(() => {
    if (!userId) return Navigation.navigate('/customers', true);
    userService.getUser(userId).then((user => {
      setUser(user)
    }));
  }, [userId, userService])

  useEffect(() => {
    userService.getCompanies().then(setCompanies);
  }, [userService])

  const handleCustomerEdition = async (payload: AddCustomerPayload): Promise<User.DTO> => {
    return new Promise(async (resolve, reject) => {
      if (!user) return reject();

      try {
        resolve(await userService.editUser(user.id, payload));
      } catch (e) {
        let message = t('editCustomerFailed');

        if (Axios.isAxiosError(e)) {
          if ((e as AxiosError).response?.status === 409) {
            message = t('editCustomerFailedDuplicate')
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
    payload.profile = {
      phone: payload.phone,
      company: payload.company,
      hatchery: payload.hatchery,
      addressLine1: payload.addressLine1,
      addressLine2: payload.addressLine2,
      zipCode: payload.zipCode,
      city: payload.city,
      country: payload.country,
    }

    await handleCustomerEdition(payload);
    toast(t('editCustomerConfirmation'));
    Navigation.goBack();
  }

  return <table className={"form"}>
    <tbody>
    <tr>
      <td/>
      <td>
        <div className={'section-title'}>{t('editCustomerDetailsLabel')}</div>
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('editCustomerFirstNameLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"firstName"}
          errorMsg={"mandatoryField"}
          required={true}
          placeholder={"editCustomerFirstNamePlaceholder"}
          defaultValue={user?.firstName}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('editCustomerLastNameLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"lastName"}
          errorMsg={"mandatoryField"}
          required={true}
          placeholder={"editCustomerLastNamePlaceholder"}
          defaultValue={user?.lastName}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('editCustomerCompanyLabel')}</label></td>
      <td>
        <SearchableSelect
          ref={ref => ref && compiler.register(ref)}
          id={"company"}
          t={t}
          errorMsg={"mandatoryField"}
          required={true}
          placeholder={"editCustomerCompanyPlaceholder"}
          defaultValue={user?.profile ? (user?.profile as CustomerProfile).company : undefined}
          validation={(v) => !!v && v?.length > 0}
          values={companies}/>
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('editCustomerHatcheryLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"hatchery"}
          t={t}
          errorMsg={"mandatoryField"}
          required={true}
          placeholder={"editCustomerHatcheryPlaceholder"}
          defaultValue={user?.profile ? (user?.profile as CustomerProfile).hatchery : undefined}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td/>
      <td>
        <div className={'section-title'}>{t('editCustomerContactLabel')}</div>
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('editCustomerEmailLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"email"}
          required={true}
          errorMsg={"invalidMail"}
          placeholder={"editCustomerEmailPlaceholder"}
          defaultValue={user?.email}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('editCustomerPhoneLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"phone"}
          t={t}
          required={true}
          errorMsg={"mandatoryField"}
          placeholder={"editCustomerPhonePlaceholder"}
          defaultValue={user?.profile ? (user?.profile as CustomerProfile).phone : undefined}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('editCustomerAddressSection')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"addressLine1"}
          required={true}
          errorMsg={"mandatoryField"}
          placeholder={"editCustomerAddressLine1Placeholder"}
          defaultValue={user?.profile ? (user?.profile as CustomerProfile).addressLine1 : undefined}
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
          required={false}
          errorMsg={"mandatoryField"}
          placeholder={"editCustomerAddressLine2Placeholder"}
          defaultValue={user?.profile ? (user?.profile as CustomerProfile).addressLine2 : undefined}
          validation={(v) => true}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('editCustomerZipCodeLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"zipCode"}
          required={true}
          errorMsg={"mandatoryField"}
          placeholder={"editCustomerZipCodePlaceholder"}
          defaultValue={user?.profile ? (user?.profile as CustomerProfile).zipCode : undefined}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('editCustomerCityLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"city"}
          required={true}
          errorMsg={"mandatoryField"}
          defaultValue={user?.profile ? (user?.profile as CustomerProfile).city : undefined}
          placeholder={"editCustomerCityPlaceholder"}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('editCustomerCountryLabel')}</label></td>
      <td>
        <TextInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"country"}
          required={true}
          errorMsg={"mandatoryField"}
          placeholder={"editCustomerCountryPlaceholder"}
          defaultValue={user?.profile ? (user?.profile as CustomerProfile).country : undefined}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>


    <tr style={{height: '1rem'}}/>
    <tr>
      <td/>
      <td>
        <div className={'section-title'}>{t('editCustomerAccessStatusLabel')}</div>
      </td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('editCustomerAccessStatusAllowedUntil')}</label></td>
      <td>
        <DateInput
          t={t}
          ref={ref => ref && compiler.register(ref)}
          id={"expireAt"}
          required={true}
          placeholder={"date picker"}
          defaultValue={user?.expireAt}
          validation={(v) => true}
        />
      </td>
      <td/>
    </tr>

    <tr className={"table-separator"}/>
    <tr>
      <td/>
      <td>
        <p className={"button light"} onClick={() => submitForm()}>{t('editCustomerSaveForm')}</p>
      </td>
      <td/>
    </tr>
    </tbody>
  </table>
    ;
}

export default CustomerEdit;