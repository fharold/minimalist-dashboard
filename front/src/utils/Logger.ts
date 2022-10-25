export const logHelper = {
  initComponent: 'font-weight:bold;color:white;background-color:black;padding:3px;',
  destroyComponent: 'font-weight:bold;color:white;background-color:darkred;padding:3px;',
  processing: 'font-weight:bold;color:deepskyblue;',
  startLoading: 'font-weight:bold;color:black;background-color:rgba(255, 99, 71, 0.5);',
  loading: 'font-weight:bold;color:darkorange;',
  finishedLoading: 'font-weight:bold;color:black;background-color:rgba(50, 205, 50, 0.5)',
  event: 'font-weight:bold;color:deeppink;',
  success: 'font-weight:bold;color:black;background-color:limegreen;',
  fail: 'font-weight:bold;color:black;background-color:lightsalmon;',
  warning: 'color:black;background-color:#FFD580;padding:3px;',
  error: 'font-weight:bold;color:white;background-color:red;padding:3px',
  subdued: 'font-weight:bold;color:slategray;',
  subduedSuccess: 'font-weight:bold;color:MediumSeaGreen;',
  subduedFailed: 'font-weight:bold;color:firebrick;',
  start: 'font-style:italic;color:MediumSeaGreen;',
  pause: 'font-style:italic;color:orange;',
  stop: 'font-style:italic;color:firebrick;',
  service: 'font-style:italic;color:deepskyblue;',
  debug: 'color:white;background-color:darkorange;padding:3px;',
};

const debugFont = 'font-family:"jetbrains mono";';

export const tLogStyled = (msg: unknown, style?: string, ...rest: unknown[]): void => {
  if (process.env.REACT_APP_LOG === 'true') {
    console.log(`%c[${Math.round(performance.now()) / 1000}] ${msg}`, debugFont + style, ...rest);
  }
};

export const tLog = (...args: unknown[]): void => {
  if (process.env.REACT_APP_LOG === 'true')
    console.log(...args);
};

export const tLogWarn = (...args: unknown[]): void => {
  if (process.env.REACT_APP_LOG === 'true')
    console.warn(...args);
};

export const tLogError = (...args: unknown[]): void => {
  // if (process.env.REACT_APP_LOG)
  console.error(...args);
};
