import {Dispatch, SetStateAction} from 'react';

export function useStateSafe<S = undefined>(initialState?: undefined): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
export function useStateSafe<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];