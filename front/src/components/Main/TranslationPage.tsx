import React, {useState} from "react";
import {ServiceRepository} from "../../services/serviceRepository";
import {Language} from "../../models/language";
import './Languages.scss';
import {MimeTypes} from "../../utils/MimeTypes";
import TextInput from "../Shared/TextInput";
import {FormCompiler} from "../../utils/Form/FormCompiler";
import {toast} from "react-toastify";
import Axios, {AxiosError} from "axios";
import {Navigation} from "../../utils/routes";
import FlagFileInput from "../Shared/FlagFileInput";
import {useParams} from "react-router-dom";
import {headerStore} from "../../stores";
import {useTranslation} from "react-i18next";

const TranslationPage: React.FC = () => {
  const [language, setLanguage] = useState<Language.DTO | undefined>(undefined);
  const languageSvc = ServiceRepository.getInstance().languageSvc;
  const {code} = useParams();
  const {t} = useTranslation();

  const compiler = new FormCompiler();

  if (!code) {
    Navigation.navigate("/translations", false);
    return <></>
  }

  if (!language) {
    languageSvc.getLanguage(code).then(fetchedLanguage => {
      setLanguage(fetchedLanguage)
    });
  }

  const setHeader = headerStore(state => state.setHeaderProps);

  setHeader({
    title: t('languageEditorPageTitle'),
    subtitle: t('languageEidtorPageSubtitle'),
    backEnabled: true
  });

  const handleLanguageEdition = async (payload: Language.DTO): Promise<Language.DTO> => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await languageSvc.editLanguage(payload));
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
        toast(t('createLanguagePageFormSubmitFailed'), {
          autoClose: 10000,
          type: "error"
        });
      }
    }
  }

  const submitForm = async () => {
    if (!compiler.checkFormValidity()) return;

    const payload: Language.DTO = compiler.compile(["name", "code"]);
    payload.visible = true;
    let language = await handleLanguageEdition(payload);

    const icon = compiler.compileSpecificInput("icon") as File;
    if (icon) await handleIconUpload(language.code, icon);

    toast(t('editLanguageSuccessful'));
  }

  return <table className={"form"}>
    <tbody>
    <tr>
      <td><label>{t('createLanguagePageFormNameLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"name"}
          required={true}
          t={t}
          errorMsg={"mandatoryField"}
          defaultValue={language?.name}
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
          t={t}
          id={"code"}
          required={true}
          errorMsg={"mandatoryField"}
          defaultValue={language?.code}
          placeholder={'createLanguagePageFormCodePlaceholder'}
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
    </tr>
    <tr>
      <td/>
      <td><div className={'section-title'}>{t('createLanguagePageFormLanguageIconTitle')}</div></td>
      <td/>
    </tr>
    <tr>
      <td/>
      <td>
        <FlagFileInput
          ref={ref => ref && compiler.register(ref)}
          placeholder={""}
          multiple={false}
          t={t}
          defaultValue={language?.icon}
          acceptedFileTypes={[MimeTypes.PNG, MimeTypes.JPEG, MimeTypes.JPG]}
          required={true}
          id={"icon"}
          validation={value => value !== undefined}
        />
        {/* TODO : should display current icon */}
      </td>
      <td/>
    </tr>
    <tr className={"table-separator"}/>
    <tr>
      <td/>
      <td>
        <p className={"button light"} onClick={() => submitForm()}>{t('createLanguagePageFormSubmitBtn')}</p>
        <div className={"space-15"}/>
        <p className={"button secondary"} onClick={() => Navigation.navigate("/translations", false)}>{t('createLanguagePageFormCancelBtn')}</p></td>
      <td/>
    </tr>
    </tbody>
  </table>;
}

export default TranslationPage;