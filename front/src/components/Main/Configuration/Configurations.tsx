import React from 'react';
import {generatePath, Link} from 'react-router-dom';
import {useStateSafe} from 'hooks';
import {headerStore} from 'stores';
import {ServiceRepository} from 'services/serviceRepository';
import {Configuration} from 'models/configuration';
import {Navigation} from 'utils/routes';

import ConfigurationProvider from 'adapter/ConfigurationProvider';
import ConfigurationAdapter from 'adapter/ConfigurationAdapter';
import List from 'components/Shared/List/List';

import 'components/Shared/List/List.scss';
import {URLs} from 'utils/urls';
import {useTranslation} from "react-i18next";

const Configurations: React.FC = () => {
  const {t} = useTranslation();
  const [dataProvider] = useStateSafe(new ConfigurationProvider(ServiceRepository.getInstance().cfgSvc));
  const [adapter] = useStateSafe(new ConfigurationAdapter(t, dataProvider, {
    rowSelected: (obj: Configuration.DTO) => {
      let url = generatePath(URLs.API.CONFIGURATION, {configurationId: obj.id});
      Navigation.navigate(url, true);
    },
    onRemoveClick(obj: Configuration.DTO) {
      alert("remove click");
    },
    onEditClick(obj: Configuration.DTO) {
      alert("edit click");
    }
  }, false));

  const setHeader = headerStore(state => state.setHeaderProps);
  setHeader({
    title: 'Configurations',
    backEnabled: true
  });

  return (
    <div className={'users-page'}>
      <List adapter={adapter} dataProvider={dataProvider}/>
      <Link className={'centered-button'} to={'/configurations/create'}>
        <button className={'button light'}>+ add new cfg</button>
      </Link>
    </div>
  );
};

export default Configurations;