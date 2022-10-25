export const FSMStates = {
  notLoaded: 'notLoaded',
  loading: 'loading',
  loaded: 'loaded',
  parsing: 'parsing',
  parsed: 'parsed',
  loadingError: 'loadingError',
  hidden: 'hidden',
  line: {
    default: 'line.default'
    // filled dynamically when custom line config is received
  } as { [p: string]: any }
};
