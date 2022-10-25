import {TFunction} from "i18next";

export interface Input<T> {
  onChange?: (value?: T) => void;
  defaultValue?: T;
  required: boolean;
  validation?: (value?: T) => boolean;
  readonly?: boolean;
  id: string;
  t: TFunction;
}