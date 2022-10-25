import create from 'zustand';
import {logHelper, tLogStyled} from 'utils/Logger';
import {FSMStates} from 'webgl/types/FSMStates';

const _initialState = FSMStates.notLoaded;

export type FSMStoreProps = {
  currentFSMState?: string;
  currentFSMStateSiblings: string[];
  fsmStateStack: string[];

  setFSMState: (nextState: string) => void;
  setPreviousFSMState: () => void;

  isSubStateOf: (parentFSMState: string | Record<string, unknown>) => boolean;
  // getParentStateOf: (state: string) => {[key: string]: string};
  getSiblingStates: (state?: string/*, includeSelf?: boolean*/) => string[];
};

export const FSMStore = create<FSMStoreProps>((set, get) => ({
  currentFSMState: _initialState,
  currentFSMStateSiblings: [],
  fsmStateStack: [_initialState],

  setFSMState: (newState) => {
    const stateStack = [...get().fsmStateStack];
    // set({currentFSMState: newState});

    tLogStyled('[FSMStore] SetState ' + newState, logHelper.event); // DEBUG

    if (newState != null) {
      // OnExit Global Event
      stateStack.push(newState);
      const siblings = get().getSiblingStates(newState);
      set({currentFSMState: newState, fsmStateStack: stateStack, currentFSMStateSiblings: siblings});
      // OnEnter Global Event
    }
  },

  setPreviousFSMState: () => {
    const stateStack = [...get().fsmStateStack];
    if (stateStack.length > 1) {
      stateStack.pop(); // Remove last state
      get().setFSMState(stateStack.pop() || ''); // Get previous state // TODO: test if double pop() is ok in TS (ok in C#)
    }
  },

  isSubStateOf: (parentFSMState) => {

    // current state is a string like 'guidedVisit.aaa.bbb'
    const {currentFSMState, isSubStateOf} = get();

    if (typeof parentFSMState === 'object') {

      return Object.keys(parentFSMState).some(key => {
        if (typeof parentFSMState[key] === 'object') {
          // @ts-expect-error can't assign undefined to Record because of missing type
          return isSubStateOf(parentFSMState[key]);
        } else {

          return parentFSMState[key] === currentFSMState;
        }
      });

    } else {
      return parentFSMState === currentFSMState;
    }
  },

  getSiblingStates: (state/*, includeSelf = false*/) => {
    if (!state) return [];

    const splitState = state.split('.');
    splitState.pop(); // remove last item
    if (splitState.length >= 1) {
      // @ts-ignore
      const siblings = Object.values(splitState.reduce((acc, cur) => acc[cur], FSMStates))
        .filter(sib => typeof sib === 'string'); //.filter(sib => includeSelf ? true : sib !== state);

      return siblings as string[];
    }
    return [];
  }
}));
