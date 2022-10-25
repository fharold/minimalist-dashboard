import React from "react";

interface ButtonProps {
  label: string,
  onClick: () => void
}

interface BoxV2Props {
  title: string,
  leftButton?: ButtonProps,
  rightButton?: ButtonProps
}

const BoxV2: React.FC<React.PropsWithChildren<BoxV2Props>> = (props: React.PropsWithChildren<BoxV2Props>) => {
  return <div className={'details'}>
    <div className={'details-header'}>
      <div>
        <p className={'details-header-label'}>{props.title}</p>
        {props.leftButton && <p onClick={props.leftButton.onClick} className={'button secondary'}>
          {props.leftButton?.label}
        </p>}
      </div>
      {props.rightButton && <button onClick={props.rightButton.onClick} className={'button light'}>
        {props.rightButton?.label}
      </button>}
    </div>
    <div className={'details-content'}>
      {props.children}
    </div>
  </div>;
}

export default BoxV2;