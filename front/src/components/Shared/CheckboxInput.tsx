import React from "react";
import "./FileInput.scss"
import {InputState} from "./TextInput";
import {InputValidator} from "../../utils/Form/InputValidator";
import {Input} from "../../utils/Form/Input";

export interface CheckboxInputProps extends Input<boolean> {
  label: string,
}

export default class CheckboxInput extends React.Component<CheckboxInputProps, InputState<boolean>> implements InputValidator<boolean> {
  constructor(props: CheckboxInputProps, state: InputState<boolean>) {
    super(props, state);

    this.state = {
      error: 0,
      value: props.defaultValue
    }
  }

  componentDidUpdate(prevProps: Readonly<CheckboxInputProps>, prevState: Readonly<InputState<boolean>>, snapshot?: any) {
    super.componentDidUpdate?.(prevProps, prevState, snapshot);
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({
        value: this.props.defaultValue
      })
    }
  }

  public checkValidity(): boolean {
    const isValid = this.props.validation?.(this.state.value) || !this.props.validation;

    this.setState({
      error: isValid ? 0 : 422
    })

    return isValid;
  }

  private _valueUpdated = (value: boolean) => {
    const isValid = this.props.validation?.(value) || !this.props.validation;
    this.setState({
      value: value,
      error: isValid ? 0 : 422
    }, () => {
      this.props.onChange?.(value);
    })
  }

  render() {
    if (!this.state) return <p>null state</p>
    const {error, value} = this.state;
    const {label, defaultValue, readonly} = this.props;

    return <>
      <input type={"checkbox"} placeholder={label}
             defaultChecked={defaultValue || false}
             readOnly={readonly}
             checked={value}
             onChange={event => this._valueUpdated(event.target.checked)}/>
      {error > 0 && <p>error</p>}
      <div className={"space-5"}/>
      <p>{this.props.t(label)}</p>
    </>;
  }

  getValue(): boolean | undefined {
    return this.state.value;
  }

  id(): string {
    return this.props.id;
  }
}
