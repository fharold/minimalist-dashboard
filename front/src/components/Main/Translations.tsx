import React, {useEffect, useState} from "react";
import {ServiceRepository} from "../../services/serviceRepository";
import {Language} from "../../models/language";
import './Languages.scss';
import {Navigation} from "../../utils/routes";
import FileInput from "../Shared/FileInput";
import {MimeTypes} from "../../utils/MimeTypes";
import {toast} from "react-toastify";
import {generatePath} from "react-router-dom";
import {URLs} from "../../utils/urls";
import {BASE_URL} from "../../services/api/httpClient";
import {FileService} from "../../services/fileService";
import {headerStore} from "../../stores";
import {useTranslation} from "react-i18next";

const LanguageItem: React.FC<{ language: Language.DTO }> = (props: { language: Language.DTO }) => {
  const key = props.language.icon?.key;
  const authSvc = ServiceRepository.getInstance().authSvc;
  const openLanguagePage = (code: string) => {
    Navigation.navigate(`/translations/${code}`, true);
  }

  return <div className={"item"} onClick={() => openLanguagePage(props.language.code)}>
    {key && <img src={FileService.getFileURL(key, authSvc)} placeholder={"/assets/img/flag_placeholder.png"} alt={"flag"}/>}
    <p>{props.language.name}</p>
  </div>
}

const AddLanguageItem: React.FC = () => {
  const {t} = useTranslation();

  return <div className={"item"} onClick={() => {
    Navigation.navigate('/createLanguage', true)
  }}>
    <img src={'assets/img/icon_add.png'} alt={"add-language"}/>
    <p>{t('languagesPageAdd')}</p>
  </div>
}


type LanguageListProps = {
  languages?: Array<Language.DTO>
}
const LanguagesList: React.FC<LanguageListProps> = (props: LanguageListProps) => {
  if (props.languages === undefined) return <div>Loading languages</div>

  return <div className={"language-list"}>
    {props.languages.map(language => <LanguageItem key={language.code} language={language}/>)}
    <AddLanguageItem/>
  </div>
}

const Translations: React.FC = () => {
  const [languages, setLanguages] = useState<Array<Language.DTO> | undefined>(undefined);
  const [csv, setCSV] = useState<File | undefined>(undefined);
  const {t} = useTranslation();
  const setHeader = headerStore(state => state.setHeaderProps);

  useEffect(() => {
    ServiceRepository.getInstance().languageSvc.listLanguages().then(languagesFetched => {
      setLanguages(languagesFetched.data)
    });
  }, [])

  setHeader({
    title: t('languageEditorPageTitle'),
    backEnabled: true
  });


  const submitCSV = async () => {
    const translationSvc = ServiceRepository.getInstance().translationSvc;

    if (!csv) return;

    try {
      toast(t('languageEditorPageCsvSaving'));
      await translationSvc.sendCSV(csv);
      toast(t('languageEditorPageCsvSaved'));
    } catch (e) {
      console.log(e);
      toast(t('languageEditorPageCsvFail'), {
        autoClose: 10000,
        type: "error"
      });
    }
  };

  return <div className={"content"}>
    <div className={'section-title'}>{t('cevaAdminDashboardLanguages')}</div>
    <LanguagesList languages={languages}/>
    <div className={'section-title'}>{t('languagesPageEditCsvSection')}</div>
    <div className={"csv-input-container"}>
      <FileInput
        t={t}
        required={true}
        placeholder={'languageEditorFileInputPlaceholder'}
        multiple={false}
        readonly={false}
        acceptedFileTypes={[MimeTypes.CSV, MimeTypes.EXCEL]}
        onChange={value => {value && value?.length > 0 && setCSV(value[0] as File)}}
        id={"csv"}
      />
      <a
        className={"download-button"}
        href={BASE_URL + generatePath(URLs.API.TRANSLATION_DL + "?format=CSV&type=INTERFACE")}>
        {t('languageEditorDownloadCsv')}
      </a>
    </div>
    <span className={"button light"} onClick={() => submitCSV()}>
      {t('languageEditorSaveSettings')}
    </span>
  </div>;
}

export default Translations;