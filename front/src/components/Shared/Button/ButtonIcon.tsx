import React, {useCallback, useEffect, useRef} from 'react';
import {ButtonIconProps, ButtonType} from 'components/Shared/Button/ButtonProps';

import 'components/Shared/Button/ButtonIcon.scss';
import {useTranslation} from "react-i18next";

const setDefault = (element: HTMLDivElement, url: string) => {
  element.style.backgroundImage = `url("${url}_default.png")`;
};
const setHover = (element: HTMLDivElement, url: string) => {
  element.style.backgroundImage = `url("${url}_hover.png")`;
};
const setActive = (element: HTMLDivElement, url: string) => {
  element.style.backgroundImage = `url("${url}_active.png")`;
};

const ButtonIcon: React.FC<ButtonIconProps> = (props) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const pointerUp = useRef<boolean>(true);
  const pointerOut = useRef<boolean>(true);
  const {t} = useTranslation();

  useEffect(() => {
    window.addEventListener("pointerup",  onUp); //non-touch devices
    window.addEventListener("pointercancel",  onUp); //touch devices

    return () => {
      window.removeEventListener("pointerup",  onUp); //non-touch devices
      window.removeEventListener("pointercancel",  onUp); //touch devices
    }
  })

  const onLeave = useCallback((e) => {
    pointerOut.current = true;
    if (buttonRef.current && pointerUp.current)
      setDefault(buttonRef.current, props.iconUrl);
  }, [props.iconUrl]);

  const onEnter = useCallback((e) => {
    pointerOut.current = false;
    if (buttonRef.current)
      setHover(buttonRef.current, props.iconUrl);
  }, [props.iconUrl]);

  const onDown = useCallback((e) => {
    pointerUp.current = false;
    if (buttonRef.current)
      setActive(buttonRef.current, props.iconUrl);
  }, [props.iconUrl]);

  const onUp = useCallback((e) => {
    if (buttonRef.current && pointerOut.current && !pointerUp.current) {
      pointerUp.current = true;
      setDefault(buttonRef.current, props.iconUrl);
    }
  }, [props.iconUrl]);

  return (
    <div ref={buttonRef} className={`button-icon button light${props.buttonType === ButtonType.VERTICAL ? ' button-icon-vertical': ''}`}
      onClick={props.onClick}
      style={{backgroundImage: `url("${props.iconUrl}_default.png")`, maxWidth: !!props.maxWidth ? props.maxWidth : undefined }} // initial background
      onPointerLeave={onLeave}
      onPointerEnter={onEnter}
      onPointerDown={onDown}
    >
      <div className="button-icon-label" style={{
        fontSize: !!props.fontSize ? props.fontSize : undefined,
        lineHeight: !!props.fontSize ? props.fontSize : undefined,
        color: !!props.color ? props.color : undefined
      }}>{t(props.label)}</div>
    </div>
  );
};

export default ButtonIcon;