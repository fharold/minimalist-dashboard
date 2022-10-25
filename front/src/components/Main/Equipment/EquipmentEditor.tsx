import {EquipmentViewer} from './EquipmentViewer';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Translation} from 'models/translation';
import {Editor} from 'react-draft-wysiwyg';
import {Equipment} from 'models/equipment';
import APIFile from 'models/api/apifile';
import {FormCompiler} from 'utils/Form/FormCompiler';
import {ServiceRepository} from 'services/serviceRepository';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import {ContentState, convertToRaw, EditorState} from 'draft-js';
import {Slide, toast} from 'react-toastify';
import FileInput from 'components/Shared/FileInput';
import TextInput from 'components/Shared/TextInput';
import {MimeTypes} from 'utils/MimeTypes';
import {useEquipmentTranslations, useLanguages, useStateSafe} from 'hooks';
import {DEFAULT_LOCALE} from 'index';
import {logHelper, tLogStyled} from 'utils/Logger';
import {EquipmentViewerDataResponse} from 'hooks/useEquipmentTranslations';
import {EquipmentService} from 'services/equipmentService';
import {objectAsMap} from 'utils/ArrayUtils';
import {Language} from 'models/language';
import Spinner from 'components/Shared/Spinner';
import List from '../../Shared/List/List';
import Dialog from '../../Shared/Dialog';
import AnnotationProvider from '../../../adapter/AnnotationProvider';
import AnnotationAdapter from '../../../adapter/AnnotationAdapter';
import {Annotation} from '../../../models/annotation';
import {Navigation} from '../../../utils/routes';
import {useTranslation} from "react-i18next";

type EquipmentProps = {
  equipment: Equipment.DTO
}

export type EditorViewerProps = {
  title?: string
  description?: string
  specs?: string
  datasheetFile?: APIFile
  videoUrl?: string
  imageFiles?: APIFile[]
};

const compiler = new FormCompiler();

export const EquipmentEditor: React.FC<EquipmentProps> = (props: EquipmentProps) => {
  const equipmentSvc = useRef<EquipmentService>(ServiceRepository.getInstance().equipmentSvc);
  const annotationSvc = ServiceRepository.getInstance().annotationSvc;
  const [languages, languageSvc] = useLanguages();
  const [equipment, setEquipment] = useStateSafe<Equipment.DTO>(props.equipment);
  const [localeCode, setLocaleCode] = useStateSafe<string>(languageSvc.currentLanguage?.code || DEFAULT_LOCALE); // TODO user localeCode by default?

  const [annotationDialogVisibility, setAnnotationDialogVisibility] = useState<boolean>(false);
  const [deleteAnnotationDialogSelectedItem, setDeleteAnnotationDialogSelectedItem] = useState<Annotation.DTO | undefined>(undefined);

  const equipmentTranslations = useEquipmentTranslations(equipment, true);
  const [equipmentDraft, setEquipmentDraft] = useStateSafe<EquipmentViewerDataResponse>(equipmentTranslations);
  const [viewerProps, setViewerProps] = useStateSafe<EditorViewerProps>({});

  const [descriptionState, setDescriptionState] = useStateSafe<EditorState>(/*EditorState.createWithContent(ContentState.createFromText(equipmentDraft.descriptionDTO?.values.get(localeCode) || ''))*/);
  const [specsState, setSpecsState] = useStateSafe<EditorState>(/*EditorState.createWithContent(ContentState.createFromText(equipmentDraft.specsDTO?.values.get(localeCode) || ''))*/);

  const [annotationProvider] = useState(new AnnotationProvider(annotationSvc, equipment.id));
  const {t} = useTranslation();

  const annotationAdapter = useMemo(() => new AnnotationAdapter(t, annotationProvider, {
    async rowSelected(obj: Annotation.DTO) {
      setAnnotationDialogVisibility(false);
      Navigation.navigate(`/annotations/${obj.id}`, true);
    },
    onEditClick(obj: Annotation.DTO) {
      Navigation.navigate(`/annotations/${obj.id}`, true);
    },
    onRemoveClick(obj: Annotation.DTO) {
      setDeleteAnnotationDialogSelectedItem(obj);
    }
  }), [annotationProvider]);


  const [unsaved, setUnsaved] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);

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

  useEffect(() => {
    setEquipmentDraft(equipmentTranslations);
    tLogStyled('[EquipmentEditor] Equipment translations changed, updating draft...', logHelper.event, equipmentTranslations);
  }, [equipmentTranslations, setEquipmentDraft]);

  //#endregion

  //#region Updating Viewer

  useEffect(() => {
    setViewerProps({
      title: equipmentDraft.titleDTO?.values.get(localeCode),
      description: equipmentDraft.descriptionDTO?.values.get(localeCode),
      specs: equipmentDraft.specsDTO?.values.get(localeCode),
      datasheetFile: equipmentDraft.datasheetMap?.get(localeCode),
      videoUrl: equipmentDraft.videoMap?.get(localeCode),
      imageFiles: equipmentDraft.imagesMap?.get(localeCode)
    });
  }, [equipmentDraft, localeCode, setViewerProps]);

  //#endregion

  //#region Updating Editor States

  // WYSIWYG
  useEffect(() => {
    tLogStyled('[EquipmentEditor] Set WYSIWYG Editor States', logHelper.subdued);
    const {
      contentBlocks: descriptionContentBlocks,
      entityMap: descriptionEntityMap
    } = htmlToDraft(equipmentDraft.descriptionDTO?.values.get(localeCode) || '');
    setDescriptionState(EditorState.createWithContent(ContentState.createFromBlockArray(descriptionContentBlocks, descriptionEntityMap)));
    const {
      contentBlocks: specsContentBlocks,
      entityMap: specsEntityMap
    } = htmlToDraft(equipmentDraft.specsDTO?.values.get(localeCode) || '');
    setSpecsState(EditorState.createWithContent(ContentState.createFromBlockArray(specsContentBlocks, specsEntityMap)));
  }, [equipmentDraft, localeCode, setDescriptionState, setSpecsState]);

  const getThumbnailFile = useCallback(() => {
    const thumbnail = equipmentDraft.illustration;
    return thumbnail ? [thumbnail] : undefined;
  }, [equipmentDraft]);

  // Datasheets
  const getDatasheetFile = useCallback(() => {
    const datasheet = equipmentDraft.datasheetMap?.get(localeCode);
    return datasheet ? [datasheet] : undefined;
  }, [equipmentDraft, localeCode]);

  const getImageFiles = useCallback(() => {
    const images = equipmentDraft.imagesMap?.get(localeCode);
    return images ? images : undefined;
  }, [equipmentDraft, localeCode]);

  //#endregion

  //#region Saving Changes

  const handleThumbnailUpload = async (equipmentId: string, thumbnail: File | APIFile) => {
    if (!equipmentId || !thumbnail || APIFile.isAnAPIFile(thumbnail)) return; // skip APIFiles...

    return new Promise<boolean>((resolve, reject) => {
      equipmentSvc.current // TODO uncomment to save
        .addFile(equipmentId, thumbnail as File, Equipment.FileType.ILLUSTRATION)
        .then((res) => {
          tLogStyled(`[EquipmentEditor.handleThumbnailUpload] Thumbnail ${(thumbnail as File).name} UPLOADED`, logHelper.success, thumbnail);
          resolve(res);
        })
        .catch((e) => {
          toast(<>{t('equipmentEditorThumbnailUploadFailed', {
            thumbnail: (thumbnail as File).name,
            error: e.message
          })}</>, {
            transition: Slide,
            autoClose: 10000,
            type: 'error'
          });
          tLogStyled(`[EquipmentEditor.handleThumbnailUpload] Could not upload ${(thumbnail as File).name}`, logHelper.error, e, thumbnail);
          reject(e);
        });
    });
  };
  const handleThumbnailDelete = async (equipmentId: string, previousThumbnail?: APIFile, uploadedThumbnail?: File | APIFile) => {
    if (!equipmentId || !previousThumbnail) return;

    const _fileExists = uploadedThumbnail ? APIFile.equals(previousThumbnail, uploadedThumbnail) : false;

    if (!_fileExists) { // previous file has been removed
      return new Promise<boolean>((resolve, reject) => {
        equipmentSvc.current
          .deleteFile(equipmentId, Equipment.FileType.ILLUSTRATION, previousThumbnail.key, undefined)
          .then((res) => {
            tLogStyled(`[EquipmentEditor.handleThumbnailDelete] Thumbnail ${previousThumbnail.originalname} DELETED`, logHelper.success, previousThumbnail)
            resolve(res);
          })
          .catch(e => {
            toast(<>{t('equipmentEditorThumbnailDeleteFailed', {
              thumbnail: previousThumbnail.originalname,
              key: previousThumbnail.key
            })}</>, {
              transition: Slide,
              autoClose: 10000,
              type: 'error'
            });
            tLogStyled(`[EquipmentEditor.handleThumbnailDelete] Could not delete thumbnail ${previousThumbnail.originalname}`, logHelper.error, e, previousThumbnail)
            reject(e);
          });
      });
    }
  };

  const handleDatasheetUpload = async (equipmentId: string, datasheets: Map<string, File | APIFile>) => {
    if (!equipmentId || !datasheets || datasheets.size < 1) return;

    const promises: Promise<boolean>[] = [];

    datasheets.forEach((datasheetFile, locale) => {
      if (!datasheetFile || APIFile.isAnAPIFile(datasheetFile)) return; // skip APIFiles... TODO maybe compare with previousFile?

      const uploadPromise = new Promise<boolean>((resolve, reject) => {
        equipmentSvc.current // TODO uncomment to save
          .addFile(equipmentId, datasheetFile as File, Equipment.FileType.DATASHEET, locale)
          .then((res) => {
            console.log('Datasheet saved', locale, datasheetFile);
            tLogStyled(`[EquipmentEditor.handleDatasheetUpload] Datasheet ${(datasheetFile as File).name} UPLOADED`, logHelper.success, datasheetFile);
            resolve(res);
          })
          .catch((e) => {
            toast(<>{t('equipmentEditorDatasheetUploadFailed', {
              datasheet: (datasheetFile as File).name,
              error: e.message
            })}</>, {
              // toast(<>Failed to upload datasheet: <br/>{(datasheetFile as File).name}<br/>{e.message}</>, {
              transition: Slide,
              autoClose: 10000,
              type: 'error'
            });
            tLogStyled(`[EquipmentEditor.handleDatasheetUpload] Could not upload ${(datasheetFile as File).name}`, logHelper.error, e, datasheetFile);
            reject(e);
          });
      });

      promises.push(uploadPromise);
    });

    return Promise.allSettled(promises);
  };
  const handleDatasheetDelete = async (equipmentId: string, previousDatasheets: Map<string, APIFile>, uploadedDatasheets: Map<string, File | APIFile>) => {
    if (!equipmentId || !previousDatasheets || previousDatasheets.size < 1) return;

    const promises: Promise<boolean>[] = [];

    objectAsMap<APIFile>(previousDatasheets).forEach((_previousFile, _locale) => {
      // _previousFiles.forEach(_previousFile => {
      const _uploadedDatasheet = uploadedDatasheets.get(_locale);
      const _fileExists = _uploadedDatasheet ? APIFile.equals(_previousFile, _uploadedDatasheet) : false;

      if (!_fileExists) { // file has been removed from the list
        const uploadPromise = new Promise<boolean>((resolve, reject) => {
          equipmentSvc.current
            .deleteFile(equipmentId, Equipment.FileType.DATASHEET, _previousFile.key, _locale)
            .then((res) => {
              tLogStyled(`[EquipmentEditor.handleDatasheetDelete] Datasheet ${_previousFile.originalname} DELETED`, logHelper.success, _previousFile)
              resolve(res);
            })
            .catch(e => {
              toast(<>{t('equipmentEditorDatasheetDeleteFailed', {
                thumbnail: _previousFile.originalname,
                key: _previousFile.key
              })}</>, {
                transition: Slide,
                autoClose: 10000,
                type: 'error'
              });
              tLogStyled(`[EquipmentEditor.handleDatasheetDelete] Could not delete datasheet ${_previousFile.originalname}`, logHelper.error, e, _previousFile)
              reject(e);
            });
        });

        promises.push(uploadPromise);
      }
      // });
    });

    return Promise.allSettled(promises);
  };

  const handlePicturesUpload = async (equipmentId: string, pictures: Map<string, (File | APIFile)[]>) => {
    if (!equipmentId || !pictures || pictures.size < 1) return;

    const promises: Promise<boolean>[] = [];

    pictures.forEach((_pictureFiles, _locale) => {
      for (let pictureFile of _pictureFiles) {
        if (APIFile.isAnAPIFile(pictureFile)) continue; // skip APIFiles... TODO maybe compare with previousFile?

        const uploadPromise = new Promise<boolean>((resolve, reject) => {
          equipmentSvc.current
            .addFile(equipmentId, pictureFile as File, Equipment.FileType.PICTURE, _locale)
            .then((res) => {
              tLogStyled(`[EquipmentEditor.handlePicturesUpload] Picture ${(pictureFile as File).name} UPLOADED`, logHelper.success, pictureFile);
              resolve(res);
            })
            .catch((e) => {
              toast(<>{t('equipmentEditorPictureUploadFailed', {
                picture: (pictureFile as File).name,
                error: e.message
              })}</>, {
                transition: Slide,
                autoClose: 10000,
                type: 'error'
              });
              tLogStyled(`[EquipmentEditor.handlePicturesUpload] Could not upload ${(pictureFile as File).name}`, logHelper.error, e, pictureFile);
              reject(e);
            });
        });

        promises.push(uploadPromise);
      }
    });

    return Promise.allSettled(promises);
  };
  const handlePicturesDelete = async (equipmentId: string, previousPictures: Map<string, (APIFile)[]>, updatedPictures: Map<string, (File | APIFile)[]>) => {
    if (!equipmentId || !previousPictures || previousPictures.size < 1) return;

    const promises: Promise<boolean>[] = [];

    objectAsMap<APIFile[]>(previousPictures).forEach((_previousFiles, _locale) => {
      _previousFiles.forEach(_previousFile => {
        const _fileExists = updatedPictures.get(_locale)?.some(_updatedFile =>
          APIFile.equals(_previousFile, _updatedFile));

        if (!_fileExists) { // file has been removed from the list
          const uploadPromise = new Promise<boolean>((resolve, reject) => {
            equipmentSvc.current
              .deleteFile(equipmentId, Equipment.FileType.PICTURE, _previousFile.key, _locale)
              .then((res) => {
                tLogStyled(`[EquipmentEditor.handlePicturesDelete] Picture ${_previousFile.originalname} DELETED`, logHelper.success, _previousFile)
                resolve(res);
              })
              .catch(e => {
                toast(<>{t('equipmentEditorPictureDeleteFailed', {
                  picture: _previousFile.originalname,
                  key: _previousFile.key
                })}</>, {
                  transition: Slide,
                  autoClose: 10000,
                  type: 'error'
                });
                tLogStyled(`[EquipmentEditor.handlePicturesDelete] Could not delete picture ${_previousFile.originalname}`, logHelper.error, e, _previousFile)
                reject(e);
              });
          });

          promises.push(uploadPromise);
        }
      });
    })

    return Promise.allSettled(promises);
  };

  const submitForm = async () => {
    setSaving(true);

    const translationSvc = ServiceRepository.getInstance().translationSvc;
    if (!compiler.checkFormValidity()) return;

    toast.dismiss(); // close all previous toasts
    let toastRef = toast(t('equipmentEditorUpdatingEquipment'), {transition: Slide});

    if (!!equipmentDraft.titleDTO) await translationSvc.updateTranslation(equipment.name, equipmentDraft.titleDTO);
    if (!!equipmentDraft.descriptionDTO) await translationSvc.updateTranslation(equipment.description, equipmentDraft.descriptionDTO);
    if (!!equipmentDraft.specsDTO) await translationSvc.updateTranslation(equipment.specs, equipmentDraft.specsDTO);

    // if (!!equipmentDraft.illustration) { // TODO UNCOMMENT NEED TO RECEIVE ILLUSTRATION FROM BACKEND
    //   // delete first otherwise field will be emptied
    //   await handleThumbnailDelete(equipment.id, equipment.illustration, equipmentDraft.illustration);
    //   await handleThumbnailUpload(equipment.id, equipmentDraft.illustration);
    // }

    if (!!equipmentDraft.datasheetMap) {
      // delete first otherwise field will be emptied
      await handleDatasheetDelete(equipment.id, equipment.datasheets, equipmentDraft.datasheetMap);
      await handleDatasheetUpload(equipment.id, equipmentDraft.datasheetMap);
    }

    if (!!equipmentDraft.videoMap) {
      // setEquipment(await equipmentSvc.current.editEquipment(equipment.id, equipmentDraft.videoMap)); // TODO setEquipment useful ??
      await equipmentSvc.current.editEquipment(equipment.id, equipmentDraft.videoMap); // TODO setEquipment useful ??
    }

    if (!!equipmentDraft.imagesMap) {
      await handlePicturesDelete(equipment.id, equipment.pictures, equipmentDraft.imagesMap);
      await handlePicturesUpload(equipment.id, equipmentDraft.imagesMap);
    }

    toast.dismiss(toastRef);
    // toast.update(toastRef, {render: 'Equipment updated', transition: Slide});
    toast(t('equipmentEditorEquipmentCreated'), {transition: Slide});

    setUnsaved(false);
    setSaving(false);

    const eq = await equipmentSvc.current.getEquipment(equipment.id);
    setEquipment(eq);
  };
  //#endregion

  const deleteAnnotation = async (annotation: Annotation.DTO) => {
    toast(t('equipmentEditorRemovingAnnotation'), {transition: Slide});
    await annotationSvc.removeAnnotation(annotation.id);
    toast(t('equipmentEditorAnnotationRemoved'), {transition: Slide});
    await annotationProvider.load()
    setDeleteAnnotationDialogSelectedItem(undefined);
  };

  //#region onChanges
  const onLanguageChanged = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setLocaleCode(e.target.value), [setLocaleCode]);

  const onTitleChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (equipmentDraft.titleDTO) {
      setUnsaved(true);
      equipmentDraft.titleDTO = Translation.Utils.setNewValue(equipmentDraft.titleDTO, localeCode, e.target.value);
      setViewerProps({...viewerProps, title: e.target.value});
      tLogStyled('[EquipmentEditor] onTitleChanged', logHelper.subdued);
    }
  }, [equipmentDraft, localeCode, setViewerProps, viewerProps]);

  const onDescriptionChanged = useCallback((e: EditorState) => {
    if (equipmentDraft.descriptionDTO) {
      setUnsaved(true);
      setDescriptionState(e);
      let _html = draftToHtml(convertToRaw(e.getCurrentContent()));
      if (_html === '<p></p>\n') _html = ''; // prevent invisible <p></p>
      equipmentDraft.descriptionDTO.values.set(localeCode, _html);
      setViewerProps({...viewerProps, description: _html});
      tLogStyled('[EquipmentEditor] onDescriptionChanged', logHelper.subdued, e);
    }
  }, [equipmentDraft, setDescriptionState, localeCode, setViewerProps, viewerProps]);

  const onSpecsChanged = useCallback((e: EditorState) => {
    if (equipmentDraft.specsDTO) {
      setUnsaved(true);
      setSpecsState(e);
      let _html = draftToHtml(convertToRaw(e.getCurrentContent()));
      if (_html === '<p></p>\n') _html = ''; // prevent invisible <p></p>
      equipmentDraft.specsDTO.values.set(localeCode, _html);
      setViewerProps({...viewerProps, specs: _html});
      // @ts-ignore
      tLogStyled('[EquipmentEditor] onDescriptionChanged', logHelper.subdued, e);
    }
  }, [equipmentDraft, setSpecsState, localeCode, setViewerProps, viewerProps]);

  const onThumbnailChanged = useCallback((file: (File | APIFile)[] | undefined) => {
    if (!file) equipmentDraft.illustration = undefined;
    else equipmentDraft.illustration = file[0] as APIFile;
    setUnsaved(true);
    tLogStyled('[EquipmentEditor] onThumbnailChanged', logHelper.subdued, equipmentDraft.illustration);
  }, [equipmentDraft]);

  const onDatasheetChanged = useCallback((file: (File | APIFile)[] | undefined) => {
    if (equipmentDraft.datasheetMap) {
      if (!file) equipmentDraft.datasheetMap.delete(localeCode);
      else equipmentDraft.datasheetMap.set(localeCode, file[0] as APIFile);
      setUnsaved(true);
      setViewerProps({...viewerProps, datasheetFile: file ? file[0] as APIFile : undefined});
      tLogStyled('[EquipmentEditor] onDatasheetChanged', logHelper.subdued, equipmentDraft.datasheetMap);
    }
  }, [equipmentDraft, localeCode, setViewerProps, viewerProps]);

  const onVideoChanged = useCallback((videoUrl?: string) => {
    if (equipmentDraft.videoMap) {
      setUnsaved(true);
      if (!videoUrl) equipmentDraft.videoMap.delete(localeCode);
      else equipmentDraft.videoMap.set(localeCode, videoUrl);
      setUnsaved(true);
      setViewerProps({...viewerProps, videoUrl: videoUrl});
      tLogStyled('[EquipmentEditor] onVideoChanged', logHelper.subdued, videoUrl);
    }
  }, [equipmentDraft, localeCode, setViewerProps, viewerProps]);

  const onImagesChanged = useCallback((files: (File | APIFile)[] | undefined) => {
    if (equipmentDraft.imagesMap) {
      if (!files) equipmentDraft.imagesMap.delete(localeCode);
      else equipmentDraft.imagesMap.set(localeCode, files as APIFile[]);
      setUnsaved(true);
      setViewerProps({...viewerProps, imageFiles: files ? files as APIFile[] : undefined});
      tLogStyled('[EquipmentEditor] onImagesChanged', logHelper.subdued, equipmentDraft.imagesMap);
    }
  }, [equipmentDraft, localeCode, setViewerProps, viewerProps]);

//#endregion
  // console.log('RENDER');

  return <div className={'equipment-editor'}>
    <div className={`saving-overlay${isSaving ? ' visible' : ''}`}><Spinner/></div>
    <div className={'edition'}>
      <table className={'form-equip'}>
        <tbody>
        <tr>
          <td><label>{t('equipmentEditorNameLabel')}</label></td>
          <td><input type={'text'}
                     value={equipmentDraft.titleDTO?.values.get(localeCode) || undefined}// readOnly={title === undefined} // TODO undefined generates a warning in console
                     onChange={onTitleChanged}
                     placeholder={'equipmentEditorNamePlaceholder'}/>
          </td>
        </tr>
        <tr>
          <td><label>{t('equipmentEditorDescriptionLabel')}</label></td>
          <td>
            <Editor
              editorState={descriptionState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onDescriptionChanged}
              placeholder={'equipmentEditorDescriptionPlaceholder'}
            />
          </td>
        </tr>
        <tr>
          <td><label>{t('equipmentEditorTechnicalSpecsLabel')}</label></td>
          <td>
            <Editor
              editorState={specsState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onSpecsChanged}
              placeholder={'equipmentEditorTechnicalSpecsPlaceholder'}
            />
          </td>
        </tr>
        <tr>
          <td><label>{t('equipmentEditorLanguage')}</label></td>
          {/*TODO move on top??*/}
          <td>
            <select onChange={onLanguageChanged} value={localeCode} /* defaultValue={localeCode}*/>
              {languages && languages?.map(language => <option key={language.code}>{language.code}</option>)}
            </select>
          </td>
        </tr>
        <tr>
          <td className={'form-left'}/>
          <td className={'form-right'}>
            <div className={'section-title'}>{t('equipmentEditorUploadLabel', {locale: localeCode})}</div>
          </td>
        </tr>
        {/*<tr>*/} {/* TODO UNCOMMENT NEED TO RECEIVE ILLUSTRATION FROM BACKEND */}
        {/*  <td className={'form-left'}><label>Thumbnail</label></td>*/}
        {/*  <td><FileInput*/}
        {/*    ref={ref => ref && compiler.register(ref)}*/}
        {/*    placeholder={'Select a thumbnail'}*/}
        {/*    multiple={false}*/}
        {/*    defaultValue={getThumbnailFile()}*/}
        {/*    onChange={onThumbnailChanged}*/}
        {/*    //TODO set current files*/}
        {/*    acceptedFileTypes={[MimeTypes.JPG, MimeTypes.JPEG, MimeTypes.PNG]}*/}
        {/*    id={'thumbnail'}*/}
        {/*    required={false}*/}
        {/*  /></td>*/}
        {/*</tr>*/}
        <tr>
          <td className={'form-left'}><label>{t('equipmentEditorDatasheetInputLabel')}</label></td>
          <td><FileInput
            ref={ref => ref && compiler.register(ref)}
            placeholder={'equipmentEditorDatasheetInputPlaceholder'}
            t={t}
            multiple={false}
            defaultValue={getDatasheetFile()}
            onChange={onDatasheetChanged}
            //TODO set current files
            acceptedFileTypes={[MimeTypes.PDF]}
            id={'datasheet'}
            required={true}
          /></td>
        </tr>
        <tr>
          <td><label>{t('equipmentEditorVideoLabel')}</label></td>
          <td>
            <TextInput
              t={t}
              ref={ref => ref && compiler.register(ref)}
              id={'videoLink'}
              errorMsg={"mandatoryField"}
              defaultValue={equipmentDraft.videoMap?.get(localeCode) || ''}
              onChange={onVideoChanged}
              required={false}
              placeholder={'equipmentEditorVideoPlaceholder'}/>
          </td>
        </tr>
        <tr>
          <td><label>{t('equipmentEditorPicturesLabel')}</label></td>
          <td className={'form-limit-width'}><FileInput
            ref={ref => ref && compiler.register(ref)}
            placeholder={'equipmentEditorPicturesPlaceholder'}
            multiple={true}
            t={t}
            defaultValue={getImageFiles()}
            onChange={onImagesChanged}
            acceptedFileTypes={[MimeTypes.JPG, MimeTypes.JPEG, MimeTypes.PNG]}
            id={'pictures'}
            required={true}
          /></td>
        </tr>
        <tr className={'table-separator'}/>
        <tr>
          <td/>
          <td>
            <p className={'button light'} onClick={() => setAnnotationDialogVisibility(true)}>{t('equipmentEditorEditAnnotations')}</p>        {/*TODO edit annotations*/}
          </td>
        </tr>
        <tr className={'table-separator'}/>
        <tr>
          <td/>
          <td>
            <p className={'button light'} onClick={() => submitForm()}>{t('equipmentEditorSaveForm')}</p>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div className={'preview'}>
      <div className="preview-title">
        <div className={'preview-label'}>
          {t('equipmentPreviewTitle', {locale: localeCode, language: languages ? languages.find(lng => lng.code === localeCode)?.name : localeCode})}
        </div>
        <div className={'unsaved-label'}>
          {unsaved ? t('equipmentPreviewUnsaved') : undefined}
        </div>
      </div>
      <EquipmentViewer equipment={equipment} editorProps={viewerProps}/>
    </div>
    <Dialog
      visible={annotationDialogVisibility}
      dismiss={() => setAnnotationDialogVisibility(false)}
      title={`equipmentPreviewAnnotationDialogTitle`}
    >
      <List adapter={annotationAdapter} dataProvider={annotationProvider}/>
      <button className={"button light"}
              onClick={() => Navigation.navigate(`/equipments/${equipment.id}/annotations/create`, true)}>
        {t('equipmentPreviewAnnotationDialogCreate')}
      </button>
    </Dialog>
    <Dialog
      visible={deleteAnnotationDialogSelectedItem !== undefined}
      dismiss={() => setDeleteAnnotationDialogSelectedItem(undefined)}
      title={`equipmentPreviewDeleteDialogTitle`}
      subtitle={'equipmentPreviewDeleteDialogSubtitle'}
      positiveButton={{
        label: "equipmentPreviewDeleteDialogConfirm", onClick: () => {
          if (deleteAnnotationDialogSelectedItem) deleteAnnotation(deleteAnnotationDialogSelectedItem);
        }
      }}
    />
  </div>;
};