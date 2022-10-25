import {useCallback, useEffect, useRef} from 'react';
import {Equipment} from 'models/equipment';
import APIFile from 'models/api/apifile';
import {ServiceRepository} from 'services/serviceRepository';
import {useStateSafe} from 'hooks/useStateSafe';
import {objectAsMap} from 'utils/ArrayUtils';
import {logHelper, tLogStyled} from 'utils/Logger';
import {Translation} from 'models/translation';

export type EquipmentViewerDataResponse = {
  isLoading: boolean;

  /* DTO & Maps */
  titleDTO?: Translation.DTO;
  descriptionDTO?: Translation.DTO;
  specsDTO?: Translation.DTO;
  datasheetMap?: Map<string, APIFile>;
  videoMap?: Map<string, string>;
  imagesMap?: Map<string, APIFile[]>;
  illustration?: APIFile;

  /* Localized */
  // title?: string;
  // description?: string;
  // specs?: string;
  // datasheetUrl?: string;
  // videoUrl?: string;
  // images: Array<APIFile>;
};

export const useEquipmentTranslations = (equipment?: Equipment.DTO, forceRefresh: boolean = false): EquipmentViewerDataResponse => {
  const translationSvc = useRef(ServiceRepository.getInstance().translationSvc);

  const equipmentId = useRef<string>(); // prevent outdated data from being shown
  const [equipmentData, setEquipmentData] = useStateSafe<EquipmentViewerDataResponse>({isLoading: true});

  const clearAll = useCallback(() => {
    tLogStyled('[useEquipmentTranslations] Clear All', logHelper.subdued);

    setEquipmentData({
      isLoading: true,
      // titleDTO: undefined,
      // descriptionDTO: undefined,
      // specsDTO: undefined,
      // datasheetMap: undefined,
      // videoMap: undefined,
      // imagesMap: undefined
    });

  }, [setEquipmentData]);

  useEffect(() => {
    if (equipment && ((equipment.id !== equipmentId.current) || forceRefresh)) { // if different equipment
      tLogStyled('[useEquipmentTranslations] Equipment updated', logHelper.subdued);

      // equipmentToken.current = generateEquipmentToken();
      equipmentId.current = equipment.id;
      clearAll();

      let _titleDTO: Translation.DTO;
      let _descriptionDTO: Translation.DTO;
      let _specsDTO: Translation.DTO;

      const promises = [
        translationSvc.current.getTranslation(equipment.name).then(t => _titleDTO = t),
        translationSvc.current.getTranslation(equipment.description).then(t => _descriptionDTO = t),
        translationSvc.current.getTranslation(equipment.specs).then(t => _specsDTO = t)
      ];

      Promise.allSettled(promises) // Promise.allSettled() instead of Promise.all() to prevent "all or nothing" behavior
        .then(res => {
          // res is not used...

          if (equipment.id === equipmentId.current) { // if response corresponds to last request
            setEquipmentData({
              isLoading: false,
              titleDTO: _titleDTO,
              descriptionDTO: _descriptionDTO,
              specsDTO: _specsDTO,
              datasheetMap: objectAsMap<APIFile>(equipment.datasheets),
              videoMap: objectAsMap<string>(equipment.videos),
              imagesMap: objectAsMap<APIFile[]>(equipment.pictures),
              illustration: equipment.illustration
            });

            tLogStyled('[useEquipmentTranslations] Retrieved Equipment translations', logHelper.subduedSuccess, res);
          } else { // outdated response
            tLogStyled('[useEquipmentTranslations] Retrieved Equipment translations OUTDATED', logHelper.subduedFailed);
          }
        });
    }
  }, [clearAll, equipment, setEquipmentData]);

  return equipmentData;
};