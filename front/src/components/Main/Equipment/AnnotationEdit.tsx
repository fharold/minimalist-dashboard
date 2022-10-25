import React, {useCallback, useEffect, useMemo} from 'react';
import {Translation} from 'models/translation';
import {FormCompiler} from 'utils/Form/FormCompiler';
import {ServiceRepository} from 'services/serviceRepository';
import {toast} from 'react-toastify';
import TextInput from 'components/Shared/TextInput';
import {useLanguages, useStateSafe} from 'hooks';
import {Language} from 'models/language';
import {Annotation} from "../../../models/annotation";
import {Navigation} from "../../../utils/routes";
import Axios, {AxiosError} from "axios";
import {useParams} from "react-router-dom";
import {headerStore} from "../../../stores";
import {useTranslation} from "react-i18next";

export const AnnotationEdit: React.FC = () => {
  const annotationSvc = ServiceRepository.getInstance().annotationSvc;
  const translationSvc = ServiceRepository.getInstance().translationSvc;
  const {id} = useParams();
  const [languages, languageSvc] = useLanguages();
  const [annotation, setAnnotation] = useStateSafe<Annotation.DTO>();
  const [title, setTitle] = useStateSafe<Translation.DTO>();
  const [description, setDescription] = useStateSafe<Translation.DTO>();
  const [localeCode, setLocaleCode] = useStateSafe('EN');

  const compiler = useMemo(() => new FormCompiler(), []);
  const setHeader = headerStore(state => state.setHeaderProps);
  const {t} = useTranslation();

  setHeader({
    title: "editAnnotationPageHeader",
    subtitle: annotation?.key,
    backEnabled: true
  });

  useEffect(() => {
    if (!id) return;
    annotationSvc.getAnnotation(id).then(setAnnotation);
  }, [annotationSvc, id, setAnnotation])

  useEffect(() => {
    if (!annotation) return;
    translationSvc.getTranslation(annotation.title).then(setTitle);
  }, [annotation, setTitle, translationSvc])

  useEffect(() => {
    if (!annotation) return;
    translationSvc.getTranslation(annotation.description).then(setDescription);
  }, [annotation, setDescription, translationSvc])

  //#region Translation updated
  useEffect(() => {
    const updateLocale = {
      onSubjectUpdate(sub: Language.DTO) {
        setLocaleCode(sub.code);
      }
    };
    languageSvc.addListener(updateLocale);

    return () => languageSvc.removeListener(updateLocale);
  }, [languageSvc, setLocaleCode]);
  //#endregion

  const handleAnnotationEdition = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      if (!annotation) return reject();
      const payload: Partial<Annotation.DTO> = compiler.compile(["key"]);

      if (annotation && payload.key && payload.key !== annotation.key) {
        await annotationSvc.editAnnotation(annotation.id, payload);
      }

      try {
        if (title) {
          title.type = Translation.FieldType.PLAIN;
          await translationSvc.updateTranslation(annotation.title, title)
        }
        if (description) {
          description.type = Translation.FieldType.PLAIN;
          await translationSvc.updateTranslation(annotation.description, description)
        }

        resolve();
      } catch (e) {
        let message = t('editAnnotationPageFailed');

        if (Axios.isAxiosError(e)) {
          if ((e as AxiosError).response?.status === 409) {
            message = t('editAnnotationPageFailedDuplicate')
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

    compileAndSaveCurrentLanguageToBuffer();

    await handleAnnotationEdition();
    toast(t('editAnnotationPageConfirmation'));
    Navigation.goBack();
  }
  //#endregion

  //#region onChanges

  const compileAndSaveCurrentLanguageToBuffer = () => {
    const payload: Partial<Annotation.DTO> = compiler.compile(["title", "description"]);

    if (payload.title) title?.values.set(localeCode, payload.title);
    if (payload.description) description?.values.set(localeCode, payload.description);
  }

  const onLanguageChanged = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    compileAndSaveCurrentLanguageToBuffer();
    setLocaleCode(e.target.value)
  }, [compileAndSaveCurrentLanguageToBuffer, setLocaleCode]);

  return <table className={'form'}>
    <tbody>
    <tr>
      <td><label>{t('editAnnotationPageKeyLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"key"}
          t={t}
          errorMsg={"mandatoryField"}
          required={true}
          placeholder={"editAnnotationPageKeyPlaceholder"}
          defaultValue={annotation?.key}
        />
      </td>
    </tr>
    <tr>
      <td/>
      <td><div className={'section-title'}>{t('editAnnotationPageDataLabel')}</div></td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('editAnnotationPageTitleLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"title"}
          t={t}
          errorMsg={"mandatoryField"}
          required={true}
          placeholder={"editAnnotationPageTitlePlaceholder"}
          defaultValue={title?.values.get(localeCode) || ""}
        />
      </td>
    </tr>
    <tr>
      <td><label>{t('editAnnotationPageDescriptionLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"description"}
          t={t}
          errorMsg={"mandatoryField"}
          required={true}
          placeholder={t('editAnnotationPageDescriptionPlaceholder')}
          defaultValue={description?.values.get(localeCode) || ""}
        />
      </td>
    </tr>
    <tr>
      <td><label>{t('editAnnotationPageLanguageLabel')}</label></td>
      {/*TODO move on top??*/}
      <td>
        <select onChange={onLanguageChanged} value={localeCode} /* defaultValue={localeCode}*/>
          {languages && languages?.map(language => <option key={language.code}>{language.code}</option>)}
        </select>
      </td>
    </tr>
    <tr className={'table-separator'}/>
    <tr>
      <td/>
      <td>
        <p className={'button light'} onClick={() => submitForm()}>{t('editAnnotationPageSave')}</p>
      </td>
    </tr>
    </tbody>
  </table>;
};