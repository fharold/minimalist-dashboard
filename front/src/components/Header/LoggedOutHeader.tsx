import React, {useCallback, useEffect, useRef} from 'react';
import {useClickAway} from 'react-use';
import {User} from 'models/user';
import {ServiceRepository} from 'services/serviceRepository';
import {Language} from 'models/language';
import {LanguageService} from 'services/languageService';
import {useTranslation} from 'react-i18next';
import {useStateSafe} from 'hooks';

import {ReactComponent as LanguageIcon} from 'assets/icons/language-icon.svg';
import {ReactComponent as HelpIcon} from 'assets/icons/help-icon.svg';
import cevaLogo from 'assets/images/logo_ceva.png';

import './Header.scss';
import {Navigation} from "../../utils/routes";

const LoggedOutHeader: React.FC = () => {
  const [languages, setLanguages] = useStateSafe<Array<Language.DTO> | undefined>(undefined); // TODO retrieve from language store/service
  const {t} = useTranslation();

  const languageDropdownRef = useRef(null);
  const [languageDropdownOpened, setLanguageDropdownOpened] = useStateSafe<boolean>(false);
  const openLanguageDropdown = useCallback(() => setLanguageDropdownOpened(!languageDropdownOpened), [languageDropdownOpened, setLanguageDropdownOpened]);
  useClickAway(languageDropdownRef, () => setLanguageDropdownOpened(false));

  const [userProfile, setUserProfile] = useStateSafe<User.DTO>();
  const userService = ServiceRepository.getInstance().userSvc;

  useEffect(() => {
    userService.addListener({
      onSubjectUpdate(sub?: User.DTO) {
        setUserProfile(sub);
      }
    });

    ServiceRepository.getInstance().languageSvc.listLanguages().then(languagesFetched => {
      setLanguages(languagesFetched.data);
    });
  }, [userService]);

  const getCurrentUserProfile = useCallback(async () => {
    try {
      setUserProfile(await userService.getCurrentUser());
    } catch (error) {
      console.error(error);
      setUserProfile(undefined);
    }
  }, [userService]);

  useEffect(() => {
    void getCurrentUserProfile();
  }, [getCurrentUserProfile]);

  return (
    <div className={`header loggedout`}>
      <div className="header-title-container loggedout">
        <div className="header-logo loggedout">
          <div className="logo">
            <img src={cevaLogo} alt="logo ceva"/>
          </div>
        </div>
        <div className={'border-wrapper loggedout'}>
          <div className={'header-title'}>
            <div className="configuration-name loggedout">{t('loggedOutHeaderTitle')}</div>
          </div>
        </div>
      </div>

      <div className="header-menu loggedout">
        <div className="language" onClick={openLanguageDropdown} ref={languageDropdownRef}>
          <LanguageIcon className={'button-light-stroke'} style={{height: '50px', width: '50px'}}/>
          <div className={`language-dropdown-content  ${languageDropdownOpened ? 'language-dropdown-opened' : ''}`}>
            {languages && languages.map(language =>
              //TODO : fix current language bug
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a key={language.code} href="#"
                className={LanguageService.areSameLanguageCode(userProfile?.preferredLanguage, language.code) ? 'language-dropdown-selected' : ''}
                onClick={() => {
                  ServiceRepository.getInstance().languageSvc.setCurrentLanguage(language.code);
                  console.log(`changed language to ${language.code}`);
                }}> {/*TODO change language*/}
                {language.name}
              </a>
            )}
          </div>
        </div>
        <div className="help" onClick={() => Navigation.navigate('/help', true)}>
          <HelpIcon className="button-dark" style={{height: '50px', width: '50px'}}/>
        </div>
      </div>

      {/*<DebugLinks/> /!*TODO REMOVE DEBUG*!/*/}

    </div>
  );
};

export default LoggedOutHeader;
