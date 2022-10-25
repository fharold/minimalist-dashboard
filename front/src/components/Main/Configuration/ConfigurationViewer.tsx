import React, {useEffect, useRef, useState} from 'react';
import {displayWebGLCanvas, updateWebGLConfiguration} from 'webgl/services/webglService';
import {useParams} from 'react-router-dom';
import Spinner from 'components/Shared/Spinner';
import {configurationStore, FSMStore} from 'webgl/stores';
import {FSMStates} from 'webgl/types/FSMStates';
import {ServiceRepository} from "../../../services/serviceRepository";
import {headerStore} from "../../../stores";
import {Configuration} from 'models/configuration';

const ConfigurationViewer: React.FC = () => {
  const {configId} = useParams();
  const {equipKey} = useParams();
  const cfgSvc = ServiceRepository.getInstance().cfgSvc;
  const [config, setConfig] = useState<Configuration.DTO | undefined>(undefined);
  const _isMounted = useRef<boolean>(true);
  const [displaySpinner, setDisplaySpinner] = useState<boolean>(false);
  const {isConfiguration3dReady, setConfigurationReadiness} = configurationStore(state => ({
    isConfiguration3dReady: state.isConfiguration3dReady,
    setConfigurationReadiness: state.setConfiguration3dReadiness
  }));
  const setFSMState = FSMStore(state => state.setFSMState);
  const setHeader = headerStore(state => state.setHeaderProps);

  // retrieve config
  useEffect(() => {
    setConfigurationReadiness(false);

    if (configId) { // retrieve configuration from configId
      cfgSvc.getConfiguration(configId)
        .then(configDTO => {
          if (_isMounted.current) { // TODO useStateSafe instead?
            updateWebGLConfiguration(configDTO); // observed by `Configuration3D` component
            setConfig(configDTO);
          }
        })
        .catch(console.error);

    } else if (equipKey) { // create configuration on the fly for viewing unique equipments

      const equipConfigDTO = new Configuration.DTO(
        'randomId',
        'randomKey',
        'randomName',
        // @ts-ignore Room
        'randomRoom',
        true,
        [equipKey],
        'crateKey',
        'crateContentKey',
        false,
        'relatedCustomer',
        'sourceCfg',
        'createdAt',
        'createdBy'
      );

      if (_isMounted.current) { // TODO useStateSafe instead?
        updateWebGLConfiguration(equipConfigDTO); // observed by `Configuration3D` component
        setConfig(equipConfigDTO);
      }
    }

    return () => { // UNMOUNT
      _isMounted.current = false;
      setFSMState(FSMStates.hidden);
      displayWebGLCanvas(false); // hide webgl canvas when component is unmounted
      // setConfigurationReadiness(false);
      updateWebGLConfiguration(); // clear configuration when component is unmounted
      setConfig(undefined);
    };
  }, [equipKey, cfgSvc, configId, setConfigurationReadiness, setFSMState]);



  // Hide spinner and display canvas when configuration is parsed
  useEffect(() => {
    setDisplaySpinner(!isConfiguration3dReady);
    displayWebGLCanvas(isConfiguration3dReady);
    if (isConfiguration3dReady && configId) setFSMState(FSMStates.line.default);
    if (isConfiguration3dReady && equipKey) setFSMState(FSMStates.line[equipKey]);
  }, [configId, equipKey, isConfiguration3dReady, setFSMState]);



  setHeader({
    title: `${config?.name}`,
    backEnabled: true,
    currentRoom: config?.room
  });

  if (displaySpinner) {
    return <Spinner/>;
  } else {
    return null;
  }
};

export default ConfigurationViewer;