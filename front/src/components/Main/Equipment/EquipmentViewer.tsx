import React, {useCallback} from 'react';
import {FileService} from 'services/fileService';
import {Equipment} from 'models/equipment';
import {Slideshow} from 'components/Main/Equipment/EquipmentPage';
import {useEquipmentTranslations, useLocale, useStateSafe} from 'hooks';
import Skeleton, {SKELETON_TYPE} from 'components/Shared/Skeleton';
import {EditorViewerProps} from 'components/Main/Equipment/EquipmentEditor';
import {ServiceRepository} from "../../../services/serviceRepository";

export type EquipmentProps = {
  equipment?: Equipment.DTO;
  editorProps?: EditorViewerProps;
}

export const EquipmentViewer: React.FC<EquipmentProps> = (props) => {
  const {localeCode} = useLocale();
  const {
    isLoading,
    titleDTO,
    descriptionDTO,
    specsDTO,
    datasheetMap,
    videoMap,
    imagesMap
  } = useEquipmentTranslations(props.equipment);
  const [slideshowVisibility, setSlideshowVisibility] = useStateSafe<boolean>(false);
  const authSvc = ServiceRepository.getInstance().authSvc;

  // useEffect(() => {
  //   if (props.editorProps)
  //     tLogStyled('[EquipmentViewer] Content overridden by EquipmentEditor', logHelper.subdued, props.editorProps);
  // }, [props.editorProps]);

  const getTitle = useCallback((_localeCode: string) => {
    return (props.editorProps ? props.editorProps?.title : titleDTO?.values.get(_localeCode)) || 'No title';
  }, [props.editorProps, titleDTO?.values]);

  const getDescription = useCallback((_localeCode: string) => {
    return (props.editorProps ? props.editorProps?.description : descriptionDTO?.values.get(_localeCode)) || 'No description';
  }, [props.editorProps, descriptionDTO?.values]);

  const getSpecs = useCallback((_localeCode: string) => {
    return (props.editorProps ? props.editorProps?.specs : specsDTO?.values.get(_localeCode)) || 'No specs';
  }, [props.editorProps, specsDTO?.values]);

  const getDatasheetUrl = useCallback((_localeCode: string) => {
    if (props.editorProps) {
      return props.editorProps.datasheetFile ?
        props.editorProps.datasheetFile.key ?
          FileService.getFileURL(props.editorProps.datasheetFile.key, authSvc) :
          window.URL.createObjectURL(props.editorProps.datasheetFile as unknown as Blob) :
        undefined;
    } else {
      const _key =  datasheetMap?.get(_localeCode)?.key;
      return _key ?
        FileService.getFileURL(_key, authSvc) :
        undefined;
    }
  }, [props.editorProps, datasheetMap]);

  const getVideoUrl = useCallback((_localeCode: string) => {
    return (props.editorProps ? props.editorProps?.videoUrl : videoMap?.get(_localeCode)) || undefined;
  }, [props.editorProps, videoMap])

  const getImagesUrl = useCallback((_localeCode: string) => {
    if (props.editorProps) {
      return props.editorProps.imageFiles ?
        props.editorProps.imageFiles.map(file => file.key ? // TODO BETTER TEST WITH isAnAPIFile()
          FileService.getFileURL(file.key, authSvc) :
          window.URL.createObjectURL(file as unknown as Blob)) :
        undefined;
    } else {
      const _keys =  imagesMap?.get(_localeCode)?.map(file => file.key);
      return (_keys && _keys.length > 0) ?
        _keys.map(key => FileService.getFileURL(key, authSvc)) :
        undefined;
    }
  }, [props.editorProps, imagesMap]);

  const openVideo = useCallback(() => {
    const videoUrl = getVideoUrl(localeCode);
    if (videoUrl) window.open(videoUrl.match(/^https?:\/\//i) ? videoUrl : `http://${videoUrl}`, '_blank');
  }, [getVideoUrl, localeCode]);

  const openSlideshow = useCallback(() => {
    const imagesUrl = getImagesUrl(localeCode);
    if (imagesUrl && imagesUrl.length > 0) setSlideshowVisibility(true);
  }, [getImagesUrl, localeCode, setSlideshowVisibility]);


  return (
    <div className={`equipment-viewer`}>

      <div className={'equipment-title'}>
        {isLoading ?
          <h1><Skeleton type={SKELETON_TYPE.EQUIPMENT_VIEWER_TITLE}/></h1> :
          <h1>{getTitle(localeCode)}</h1>}
      </div>

      <div className={'equipment-content'}>

        {isLoading ?
          <div className={'equipment-description'}><p><Skeleton type={SKELETON_TYPE.EQUIPMENT_VIEWER_DESCRIPTION}/></p>
          </div> :
          <div className={'equipment-description'} dangerouslySetInnerHTML={{__html: getDescription(localeCode)}}/>}

        <span className={'specs-title'}>Technical specs</span>

        {isLoading ?
          <div className={'specs-content'}><Skeleton type={SKELETON_TYPE.EQUIPMENT_VIEWER_SPECS}/></div> :
          <div className={'specs-content'}
            dangerouslySetInnerHTML={{__html: getSpecs(localeCode)}}/>}

      </div>

      <div className={'equipment-footer'}>

        <a target={'_blank'} rel="noreferrer"
          href={getDatasheetUrl(localeCode)}
          className={`horizontal-btn${getDatasheetUrl(localeCode) ? '' : ' btn-disabled'}`}>
          <img src={'/assets/img/icon_pdf_small.svg'} alt={'download'}/>
          <span>{getDatasheetUrl(localeCode) ? 'Download datasheet' : 'No datasheet available'}</span>
        </a>

        <div className={`vertical-btn${getVideoUrl(localeCode) ? '' : ' btn-disabled'}`} onClick={openVideo}>
          <img src={'/assets/img/icon_video.svg'} alt={'video'}/>
          <span>Video</span>
        </div>

        <div
          className={`vertical-btn${getImagesUrl(localeCode)?.length! > 0 ? '' : ' btn-disabled'}`}
          onClick={openSlideshow}>
          <img src={'/assets/img/icon_photo.svg'} alt={'photos'}/>
          <span>Photos</span>
        </div>

      </div>

      <Slideshow
        images={getImagesUrl(localeCode) || []}
        closeRequired={() => {
          setSlideshowVisibility(false);
        }}
        visible={slideshowVisibility}/>
    </div>);
};
