import {useEffect, useRef} from 'react';
import {useStateSafe} from 'hooks/useStateSafe';
import {ServiceRepository} from 'services/serviceRepository';
import {Language} from 'models/language';
import {LanguageService} from 'services/languageService';

export const useLanguages = (): [Language.DTO[], LanguageService] => {
  const languageSvc = useRef(ServiceRepository.getInstance().languageSvc);
  const [languages, setLanguages] = useStateSafe<Array<Language.DTO>>([]);

  useEffect(() => {
    languageSvc.current.listLanguages().then(value => setLanguages(value.data));
  }, [setLanguages]);

  return [languages, languageSvc.current];
};