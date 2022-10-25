import React from "react";
import {ServiceRepository} from "../../services/serviceRepository";
import {Language} from "../../models/language";
import './Languages.scss';
import {MimeTypes} from "../../utils/MimeTypes";
import TextInput from "../Shared/TextInput";
import CheckboxInput from "../Shared/CheckboxInput";
import {FormCompiler} from "../../utils/Form/FormCompiler";
import {toast} from "react-toastify";
import Axios, {AxiosError} from "axios";
import {Navigation} from "../../utils/routes";
import FlagFileInput from "../Shared/FlagFileInput";
import {useTranslation} from "react-i18next";

const CreateLanguage: React.FC = () => {
  const languageSvc = ServiceRepository.getInstance().languageSvc;
  const {t} = useTranslation();

  const compiler = new FormCompiler();

  const handleLanguageCreation = async (payload: Language.DTO): Promise<Language.DTO> => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await languageSvc.addLanguage(payload));
      } catch (e) {
        let message = t('createLanguagePageFailed');

        if (Axios.isAxiosError(e)) {
          if ((e as AxiosError).response?.status === 409) {
            message = t('createLanguagePageFailedDuplicate');
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

  const handleIconUpload = async (code: string, icon: File) => {
    if (icon) {
      try {
        await languageSvc.addFile(code, icon, "ICON")
        toast(t('createLanguagePageIconSaved'));
      } catch (e) {
        toast(t('createLanguagePageFailed'), {
          autoClose: 10000,
          type: "error"
        });
      }
    }
  }

  const submitForm = async () => {
    if (!compiler.checkFormValidity()) return;

    const payload: Language.DTO = compiler.compile(["name", "code", "visible"]);
    let language = await handleLanguageCreation(payload);

    const icon = compiler.compileSpecificInput("icon") as File;
    await handleIconUpload(language.code, icon);

    toast(t('createLanguagePageConfirmation'));
  }

  return <table className={"form"}>
    <tbody>
    <tr>
      <td><label>{t('createLanguagePageFormNameLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"name"}
          t={t}
          required={true}
          errorMsg={"mandatoryField"}
          placeholder={'createLanguagePageFormNamePlaceholder'}
          validation={(v) => !!v && v?.length > 0}
        />
      </td>
      <td/>
    </tr>
    <tr style={{height: '1rem'}}/>
    <tr>
      <td><label>{t('createLanguagePageFormCodeLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"code"}
          t={t}
          required={true}
          errorMsg={"mandatoryField"}
          placeholder={t('createLanguagePageFormCodePlaceholder')}
          validation={(v) => !!v && v?.length > 0}/>
      </td>
      <td>
        <div className={"info-container"}>
          <img className={"icon-info"} src={"/assets/img/icon_info.png"} alt={"info"}/>
          <div className={"tooltip"}>
            <p>{t('createLanguageTooltip')}</p>
            <img src={"/assets/img/icon_langues.png"} alt={"icon_lang"}/>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td/>
      <td>
        <div className={'section-title'}>{t('createLanguagePageFormLanguageIconTitle')}</div>
      </td>
      <td/>
    </tr>
    <tr>
      <td/>
      <td>
        <FlagFileInput
          ref={ref => ref && compiler.register(ref)}
          placeholder={""}
          t={t}
          multiple={false}
          acceptedFileTypes={[MimeTypes.PNG, MimeTypes.JPEG, MimeTypes.JPG]}
          required={true}
          id={"icon"}
          validation={value => value !== undefined}
        />
      </td>
      <td/>
    </tr>
    <tr>
      <td/>
      <td className={"visible-field"}>
        <CheckboxInput label={"createLanguagePageFormVisibleLabel"}
                       required={true}
                       t={t}
                       id={"visible"}
                       ref={ref => ref && compiler.register(ref)}
        />
      </td>
      <td/>
    </tr>
    <tr className={"table-separator"}/>
    <tr>
      <td/>
      <td>
        <p className={"button light"} onClick={() => submitForm()}>{t('createLanguagePageFormSubmitBtn')}</p>
        <div className={"space-15"}/>
        <p className={"button cancel"}
           onClick={() => Navigation.navigate("/translations", false)}>{t('createLanguagePageFormCancelBtn')}</p></td>
      <td/>
    </tr>
    </tbody>
  </table>
    ;
}

export default CreateLanguage;