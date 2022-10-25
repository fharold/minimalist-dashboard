import React from 'react';
import {useScaleWithScreenSize, useSizeClass} from 'hooks';

import './App.scss';
import Main from "./Main/Main";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "./Header/Header";

const referenceResolution = {x: 1920, y: 1080}; // prevent rerender?

const App: React.FC = () => {
  const appRef = useSizeClass();
  useScaleWithScreenSize(
    referenceResolution,
    0.2,
    8,
    16
  );

  return (
    <div ref={appRef} className="app">
      <Header/>
      <Main/>
      <ToastContainer />
    </div>
  );
};

export default App;
