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
import {Equipment} from "../../../models/equipment";
import FieldType = Translation.FieldType;
import {useTranslation} from "react-i18next";

export const AnnotationCreate: React.FC = () => {
  const annotationSvc = ServiceRepository.getInstance().annotationSvc;
  const equipmentSvc = ServiceRepository.getInstance().equipmentSvc;
  const translationSvc = ServiceRepository.getInstance().translationSvc;
  const {id} = useParams();
  const [languages, languageSvc] = useLanguages();
  const [equipment, setEquipment] = useStateSafe<Equipment.DTO>();
  const [title] = useStateSafe<Translation.DTO>({
    id: 'unused',
    type: FieldType.PLAIN,
    key: 'unused',//unused
    values: new Map<string, string>()
  });
  const [description] = useStateSafe<Translation.DTO>({
    id: 'unused',
    type: FieldType.PLAIN,
    key: 'unused',//unused
    values: new Map<string, string>()
  });
  const {t} = useTranslation();
  const [localeCode, setLocaleCode] = useStateSafe('EN');

  const compiler = useMemo(() => new FormCompiler(), []);
  const setHeader = headerStore(state => state.setHeaderProps);

  setHeader({
    title: "createAnnotationPageHeader",
    subtitle: equipment?.key,
    backEnabled: true
  });

  useEffect(() => {
    if (!id) return;
    equipmentSvc.getEquipment(id).then((equip) => {
      setEquipment(equip);
    });
  }, [equipmentSvc, id, setEquipment])

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

  const handleAnnotationCreation = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      if (!equipment) return reject();
      if (!compiler.checkFormValidity()) return reject();
      const payload: Partial<Annotation.DTO> = compiler.compile(["key"]);
      payload.style = Annotation.Style.defaultExpandable;
      payload.marker = "";
      payload.equipment = equipment.id;

      let annotation = await annotationSvc.createAnnotation(payload);

      try {
        if (title) {
          title.type = Translation.FieldType.PLAIN;
          title.key = annotation.title;
          await translationSvc.updateTranslation(annotation.title, title)
        }

        if (description) {
          description.type = Translation.FieldType.PLAIN;
          description.key = annotation.description;
          await translationSvc.updateTranslation(annotation.description, description)
        }

        resolve();
      } catch (e) {
        let message = t('createAnnotationPageFailed');

        if (Axios.isAxiosError(e)) {
          if ((e as AxiosError).response?.status === 409) {
            message = t('createAnnotationPageFailedDuplicate')
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

    await handleAnnotationCreation();
    toast(t('createAnnotationPageConfirmation'));
    Navigation.goBack();
  }
  //#endregion

  //#region onChanges
  const compileAndSaveCurrentLanguageToBuffer = useCallback(() => {
    const payload: Partial<Annotation.DTO> = compiler.compile(["title", "description"]);

    if (payload.title) title?.values.set(localeCode, payload.title);
    if (payload.description) description?.values.set(localeCode, payload.description);
  }, [compiler, description, localeCode, title])

  const onLanguageChanged = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    compileAndSaveCurrentLanguageToBuffer();
    setLocaleCode(e.target.value)
  }, [compileAndSaveCurrentLanguageToBuffer, setLocaleCode]);

  return <table className={'form'}>
    <tbody>
    <tr>
      <td><label>{t('createAnnotationPageKeyLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"key"}
          t={t}
          errorMsg={"mandatoryField"}
          required={true}
          placeholder={"createAnnotationPageKeyPlaceholder"}
        />
      </td>
    </tr>
    <tr>
      <td/>
      <td><div className={'section-title'}>{t('createAnnotationPageDataLabel')}</div></td>
      <td/>
    </tr>
    <tr>
      <td><label>{t('createAnnotationPageTitleLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"title"}
          t={t}
          errorMsg={"mandatoryField"}
          required={true}
          placeholder={"createAnnotationPageTitlePlaceholder"}
          defaultValue={title?.values.get(localeCode) || ""}
        />
      </td>
    </tr>
    <tr>
      <td><label>{t('createAnnotationPageDescriptionLabel')}</label></td>
      <td>
        <TextInput
          ref={ref => ref && compiler.register(ref)}
          id={"description"}
          t={t}
          errorMsg={"mandatoryField"}
          required={true}
          placeholder={t('createAnnotationPageDescriptionPlaceholder')}
          defaultValue={description?.values.get(localeCode) || ""}
        />
      </td>
    </tr>
    <tr>
      <td><label>{t('createAnnotationPageLanguageLabel')}</label></td>
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
        <p className={'button light'} onClick={() => submitForm()}>{t('createAnnotationPageSave')}</p>
      </td>
    </tr>
    </tbody>
  </table>;
};