import React from "react";
import './Dialog.scss'
import ButtonProps from "./Button/ButtonProps";
import {useTranslation} from "react-i18next";

export interface DialogProps {
  visible: boolean
  title: string
  dismiss: () => void;
  subtitle?: string
  content?: JSX.Element
  positiveButton?: ButtonProps
  negativeButton?: ButtonProps
}

const Dialog: React.FC<React.PropsWithChildren<DialogProps>> = (props: React.PropsWithChildren<DialogProps>) => {
  const {t} = useTranslation();

  return <div style={{display: props.visible ? 'flex' : 'none'}} className={'dialog'}>
    <img className={'dialog-close-btn'} src={'/assets/img/icon_close.png'} alt={'close'} onClick={props.dismiss}/>
    <p className={'dialog-main-text'}>{t(props.title)}</p>
    {props.subtitle && <p className={'dialog-secondary-text'}>{t(props.subtitle)}</p>}
    {props.children}
    {props.positiveButton && <button onClick={props.positiveButton.onClick} className={'button light'}>{t(props.positiveButton.label)}</button>}
    {props.negativeButton && <button onClick={props.negativeButton.onClick} className={'button secondary'}>{t(props.negativeButton.label)}</button>}
  </div>
};

export default Dialog;