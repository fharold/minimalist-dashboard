import create from 'zustand';
import {HeaderProps} from "components/Header/Header";

export type HeaderStoreProps = {
  headerProps: HeaderProps;
  setHeaderProps: (title: HeaderProps) => void;
}

export const headerStore = create<HeaderStoreProps>((set) => ({
  headerProps: {title: 'Welcome', backEnabled: false},
  setHeaderProps: (newProps) => set({headerProps: newProps}),
}));
