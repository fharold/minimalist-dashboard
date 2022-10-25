import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useClickAway} from 'react-use';
import {Link} from 'react-router-dom';
import DebugLinks from 'components/Header/DebugLinks';

import {ReactComponent as HomeIcon} from 'assets/icons/home-icon.svg';
import {ReactComponent as LanguageIcon} from 'assets/icons/language-icon.svg';
import {ReactComponent as HelpIcon} from 'assets/icons/help-icon.svg';
import {ReactComponent as LogoutIcon} from 'assets/icons/icon_logout.svg';
import cevaLogo from 'assets/images/logo_ceva.png';
import backArrowIcon from 'assets/icons/back_arrow.png';

import './Header.scss';
import {User} from '../../models/user';
import {ServiceRepository} from '../../services/serviceRepository';
import {Language} from '../../models/language';
import {LanguageService} from '../../services/languageService';
import {headerStore} from 'stores/headerStore';
import {HeaderProps} from './Header';
import {Navigation} from '../../utils/routes';
import ButtonIcon from 'components/Shared/Button/ButtonIcon';
import {ButtonType} from 'components/Shared/Button/ButtonProps';
import {pxToRem} from 'utils/HtmlClassUtils';
import {useTranslation} from "react-i18next";

const LoggedInHeader: React.FC = () => {
  const [accountType] = useState<string>('customer'); // TODO retrieve from user store/service
  const [languages, setLanguages] = useState<Array<Language.DTO> | undefined>(undefined); // TODO retrieve from language store/service

  const languageDropdownRef = useRef(null);
  const [languageDropdownOpened, setLanguageDropdownOpened] = useState<boolean>(false);
  const openLanguageDropdown = useCallback(() => setLanguageDropdownOpened(!languageDropdownOpened), [languageDropdownOpened]);
  useClickAway(languageDropdownRef, () => setLanguageDropdownOpened(false));

  const [userProfile, setUserProfile] = useState<User.DTO>();
  const userService = ServiceRepository.getInstance().userSvc;
  const authSvc = ServiceRepository.getInstance().authSvc;
  const headerProps: HeaderProps = headerStore(state => state.headerProps);
  const {t} = useTranslation();


  const logout = async () => {
    await authSvc.logout();
    // Navigation.navigate("/", false);
    window.location.reload();
  };

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

  const gotoCatalog = useCallback(() =>
    Navigation.navigate(`/equipments?room=${headerProps.currentRoom}`, true),
    [headerProps.currentRoom]);

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
    <div className={`header ${accountType}`}>
      <div className="header-title-container loggedin">
        <div className="header-logo loggedin">
          <div className="logo">
            <img src={cevaLogo} alt="logo ceva"/>
          </div>
          {headerProps.backEnabled && <div className="home">
            <Link to="/">
              <HomeIcon
                className="button-dark"
                onClick={() => console.log('goto configurations')} //TODO goto configurations
              />
            </Link>

          </div>}
          {/*<div className="back">*/}
          {/*  <BackIcon className="button-dark" onClick={() => console.log('goto configurations')}/> /!*TODO back button moved next to home button?*!/*/}
          {/*</div>*/}
        </div>
        <div className={'border-wrapper loggedin'}>
          <div className={'header-title'}>
            <div className="configuration-name">{t(headerProps.title)}</div>
            {/*TODO change page / Configuration name*/}
            <div className={`room-name  ${accountType}`}>{headerProps.subtitle && t(headerProps.subtitle)}</div>
            {/*/!*TODO change room name*!/*/}
          </div>
        </div>
      </div>

      <div className="header-catalogue">
        {userProfile && headerProps.currentRoom &&

            <ButtonIcon
              label={`${headerProps.currentRoom} room catalogue`}
              iconUrl={'/assets/img/catalog_icon'}
              onClick={gotoCatalog}
              maxWidth={pxToRem(150)}
              buttonType={ButtonType.VERTICAL}
            />
        }
      </div>

      <div className="header-menu">
        {headerProps.backEnabled && <div className="back" style={{cursor: 'pointer'}}
          onClick={() => Navigation.goBack()}>        {/*TODO implement back button*/}
          <img src={backArrowIcon} alt={'back'}/>
          <span>{t('back').toUpperCase()}</span>
        </div>}
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
        <div className="profile" onClick={() => Navigation.navigate('/profile', true)}>        {/*TODO logout button*/}
          <img src={'/assets/img/profile.png'} alt={'profile'}/>
        </div>
        {userProfile && <div className="logout" onClick={logout}>        {/*TODO logout button*/}
          <LogoutIcon className="button-dark" style={{height: '50px', width: '50px'}}/>
          <span>{t('logout')}<br/>{userProfile?.firstName + ' ' + userProfile?.lastName}</span>
        </div>}
        <div className="help" onClick={() => Navigation.navigate('/help', true)}>
          <HelpIcon className="button-dark" style={{height: '50px', width: '50px'}}/>
        </div>
      </div>

      <DebugLinks/> {/*TODO REMOVE DEBUG*/}

    </div>
  );
};

export default LoggedInHeader;
