export enum ButtonType {
  HORIZONTAL= 'HORIZONTAL',
  VERTICAL= 'VERTICAL'
}

export default interface ButtonProps {
  label: string,
  onClick: () => void
  maxWidth?: string
  fontSize?: string
  color?: string
}

export interface ButtonIconProps extends ButtonProps {
  iconUrl: string
  buttonType?: ButtonType
}