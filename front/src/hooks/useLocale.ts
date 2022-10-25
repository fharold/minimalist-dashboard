import {useEffect, useRef} from 'react';
import {useStateSafe} from 'hooks/useStateSafe';
import {ServiceRepository} from 'services/serviceRepository';
import {Language} from 'models/language';
import {DEFAULT_LOCALE} from 'index';

type LocaleResponse = {
  // locale?: Language.DTO;
  localeCode: string;
};

export const useLocale = (localeOverride?: string): LocaleResponse => {
  const languageSvc = useRef(ServiceRepository.getInstance().languageSvc);
  // const [locale, setLocale] = useStateSafe<Language.DTO | undefined>(languageSvc.current.currentLanguage);
  const [localeCode, setLocaleCode] = useStateSafe<string>(localeOverride || languageSvc.current.currentLanguage?.code || DEFAULT_LOCALE);

  // Only using Language.DTO.code
  useEffect(() => {
    const _listener = {
      onSubjectUpdate: (sub?: Language.DTO) => setLocaleCode(sub?.code || DEFAULT_LOCALE)
    };
    languageSvc.current.removeListener(_listener);
    if (!localeOverride) languageSvc.current.addListener(_listener);
    else setLocaleCode(localeOverride);
    // Only remove potential listener if override exists
  }, [localeOverride, setLocaleCode]);

  return {/*locale: locale, */localeCode: localeCode};
};