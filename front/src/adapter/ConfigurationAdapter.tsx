import React from 'react';
import ListAdapter, {AdapterListener} from '../components/Shared/List/ListAdapter';
import ConfigurationProvider from './ConfigurationProvider';
import {Configuration} from 'models/configuration';
import {ConfigurationAPIPagination} from './ConfigurationAPIPagination';
import {Column} from 'components/Shared/List/Column';
import {FileService} from "../services/fileService";
import {TFunction} from "i18next";
import {ServiceRepository} from "../services/serviceRepository";

export interface ConfigurationAdapterListener extends AdapterListener<Configuration.DTO> {
  onRemoveClick: (config: Configuration.DTO) => void;
  onEditClick: (config: Configuration.DTO) => void;
}

export default class ConfigurationAdapter extends ListAdapter<Configuration.DTO, ConfigurationAdapterListener, ConfigurationAPIPagination> {

  /**
   * constructor
   * @param t
   * @param configurationsProvider
   * @param listener
   * @param displayActions
   */
  constructor(t: TFunction, configurationsProvider: ConfigurationProvider, listener?: ConfigurationAdapterListener, displayActions = true) {
    super(t);

    this.addColumn(new Column(t('customerDetailsPageAdapterColRoomName'), 'room', this._room));
    this.addColumn(new Column(t('customerDetailsPageAdapterColCfgName'), 'name', this._name));
    this.addColumn(new Column(t('customerDetailsPageAdapterColCreationDate'), 'createdAt', this._createdAt));
    this.addColumn(new Column(t('customerDetailsPageAdapterColPDF'), 'download', this._download));
    if (displayActions)
      this.addColumn(new Column('', 'actions', this._actions));

    this.init(
      t('customerDetailsPageConfigurationListEmpty'),
      configurationsProvider,
      [],
      listener
    );
  }

  /**
   * _id
   * @returns {any}
   * @private
   * @param configuration
   */
  private _id = (configuration: Configuration.DTO): JSX.Element => {
    return <p className={'blue-hover'}>{configuration.id}</p>;
  };

  /**
   * _firstName
   * @returns {any}
   * @private
   * @param configuration
   */
  private _room = (configuration: Configuration.DTO): JSX.Element => {
    return <p className={'blue-hover'}>{configuration.room}</p>;
  };

  /**
   * _enabled
   * @returns {any}
   * @private
   * @param configuration
   */
  private _name = (configuration: Configuration.DTO): JSX.Element => {
    return <p className={'blue-hover'}>{configuration.name}</p>;
  };

  /**
   * _status
   * @returns {any}
   * @private
   * @param configuration
   */
  private _createdAt = (configuration: Configuration.DTO): JSX.Element => {
    return <p className={'blue-hover'}>{new Date(configuration?.createdAt * 1000).toLocaleDateString()}</p>;
  };

  /**
   * _configCount
   * @returns {any}
   * @private
   * @param configuration
   */
  private _download = (configuration: Configuration.DTO): JSX.Element => {
    const authSvc = ServiceRepository.getInstance().authSvc;

    return <a href={FileService.getConfigurationDatasheetURL(configuration.id, authSvc)} target={'_blank'} rel={'noreferrer'}><img
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{width: '48px', height: '48px', objectFit: 'contain'}} src={'/assets/img/icon_pdf.png'}
      alt={"download button"}/></a>;
  };

  /**
   * _actions
   * @returns {any}
   * @private
   * @param configuration
   */
  private _actions = (configuration: Configuration.DTO): JSX.Element => {
    return <p>
      <span
        onClick={(e) => {
          e.stopPropagation();
          this._listener?.onEditClick(configuration);
        }}
        className={'button secondary'}>
        {this._t('configurationAdapterEditAction')}
      </span>
      <span> </span>
      <span
        onClick={(e) => {
          e.stopPropagation();
          this._listener?.onRemoveClick(configuration);
        }}
        className={'button secondary'}>
        {this._t('configurationAdapterRemoveAction')}
      </span>
    </p>;
  };
}