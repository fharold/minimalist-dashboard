import React, {Suspense, useCallback, useEffect, useRef, useState} from 'react';
import {AdaptiveEvents, ContactShadows, Float, PresentationControls, TorusKnot} from '@react-three/drei';
import {addClass, removeClass} from 'utils/HtmlClassUtils';
import {sizeClassStore} from 'stores';
import {canvasStore, FSMStore} from 'webgl/stores';
import {FSMStates} from 'webgl/types/FSMStates';
import {ACESFilmicToneMapping, MeshPhysicalMaterial} from 'three';
import {Canvas} from '@react-three/fiber';
import BackgroundSphere from 'webgl/components/BackgroundSphere';
import RenderController from 'webgl/components/RenderController';
import Lighting from 'webgl/components/Lighting';
import Effects from 'webgl/components/Effects';
import Configuration3D from 'webgl/components/Configuration/Configuration3D';
import CameraControls from 'webgl/components/CameraControls/CameraControls';
import EquipmentDrawer from 'components/Main/Equipment/EquipmentDrawer';

import './WebGLCanvas.scss';

type WebGLCanvasProps = {
  allowBlur?: boolean
};

const WebGLCanvas: React.FC<WebGLCanvasProps> = ({allowBlur}) => {
  const webglDivRef = useRef<HTMLDivElement>(null);
  const isHidden = canvasStore(state => state.isHidden);
  const sizeClass = sizeClassStore(state => state.sizeClass);
  // const {glb} = useConfigStore(state => state.config) || {};
  const currentFSMState = FSMStore(state => state.currentFSMState);
  const [shouldRegress, setRegress] = useState<boolean>(false);

  //#region Blur Canvas DIV

  const handleBlur = useCallback(() => {
    if (currentFSMState === FSMStates.loading ||
      currentFSMState === FSMStates.loaded
      // || currentFSMState === FSMStates.screenSaver
    ) {
      setRegress(true);
      addClass(webglDivRef, 'blurred');
    } else {
      setRegress(false);
      removeClass(webglDivRef, 'blurred');
    }
  }, [currentFSMState]);

  // State Management
  useEffect(() => {
    if (allowBlur) handleBlur();
  }, [allowBlur, currentFSMState, handleBlur]);

  //#endregion

  return (
    <div
      ref={webglDivRef}
      className={`webgl-canvas ${sizeClass} ${isHidden ? 'hidden' : 'visible'}`}
    >
      <Canvas
        shadows
        dpr={[1, 1]}
        performance={{min: 0.1}}
        gl={{antialias: true, preserveDrawingBuffer: true/*, alpha: true*/}}
        onCreated={({gl}) => {
          gl.toneMapping = ACESFilmicToneMapping;
          // gl.outputEncoding = GammaEncoding; // GammaEncoding removed
        }}
        camera={{position: [0, 1.5, 2], fov: 60}}
        frameloop={'demand'}
      >

        <CameraControls/>
        <Suspense fallback={null}>

          <Lighting/>
          <BackgroundSphere/>
          <RenderController/>
          {/*  /!*<AdaptiveDpr />*!/*/}
          <AdaptiveEvents/>

          <Configuration3D/>
          {/*<DebugCube/>*/}

          {/*<gridHelper />*/}
          <Effects/>

        </Suspense>
      </Canvas>

      {!isHidden && <EquipmentDrawer/>}
    </div>
  );
};

const DebugCube = () => {
  return (
    <>
      <ambientLight intensity={0.5}/>
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[512, 512]} castShadow/>
      <PresentationControls
        global
        config={{mass: 1, tension: 170, friction: 26}}
        // snap // return to initial position on mouse release
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}>
        <Float speed={3}>
          <TorusKnot args={[1, .4, 128, 64]} scale={[0.5, 0.5, 0.5]} position={[0, .5, 0]} castShadow
                     material={new MeshPhysicalMaterial({color: 0x5895CC})}/>
        </Float>
        {/*<Watch rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]} scale={0.003} />*/}
      </PresentationControls>
      <ContactShadows rotation-x={Math.PI / 2} position={[0, -1, 0]} opacity={0.75} width={10} height={10} blur={2.6}
                      far={2}/>
      {/*<Environment preset="city" />*/}
    </>
  );
};

export default WebGLCanvas;