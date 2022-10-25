import React from 'react';
import './FileInput.scss';
import {InputValidator} from '../../utils/Form/InputValidator';
import {Input} from '../../utils/Form/Input';
import {getI18n} from "react-i18next";

export interface MultiLineTextInputProps extends Input<string> {
  placeholder: string,
  errorMsg?: string,
  type?: string
}

export interface InputState<InputType> {
  value?: InputType;
  error: number;
}

export default class MultiLineTextInput extends React.Component<MultiLineTextInputProps, InputState<string>> implements InputValidator<string> {
  _isMounted: boolean = false;

  constructor(props: MultiLineTextInputProps, state: InputState<string>) {
    super(props, state);

    this.state = {
      error: 0,
      value: props.defaultValue
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps: Readonly<MultiLineTextInputProps>, prevState: Readonly<InputState<string>>, snapshot?: any) {
    super.componentDidUpdate?.(prevProps, prevState, snapshot);
    if (prevProps.defaultValue !== this.props.defaultValue && this._isMounted) {
      this.setState({
        value: this.props.defaultValue
      });
    }
  }

  public checkValidity(): boolean {
    const isValid = this.props.validation?.(this.state.value) || !this.props.validation;

    if (this._isMounted) {
      this.setState({
        error: isValid ? 0 : 422
      });
    }

    return isValid;
  }

  render() {
    if (!this.state) return <p>null state</p>;
    const {error, value} = this.state;
    const {readonly, placeholder, errorMsg} = this.props;


    return <>
      <textarea style={{
        fontStyle: readonly ? "italic" : "normal",
        color: readonly ? "#202020" : "",
        cursor: readonly ? "not-allowed" : "auto"
      }} placeholder={this.props.t(placeholder)}
             readOnly={readonly}
             onChange={event => this._valueUpdated(event.target.value)}>
        {value}
      </textarea>
      {error > 0 && <p style={{color: 'red'}}>{this.props.t(errorMsg || 'error')}</p>}
    </>;
  }

  getValue(): string | undefined {
    return this.state.value;
  }

  id(): string {
    return this.props.id;
  }

  private _valueUpdated = (value: string) => {
    const isValid = this.props.validation?.(value) || !this.props.validation;

    if (this._isMounted) {
      this.setState({
        value: value,
        error: isValid ? 0 : 422
      }, () => {
        this.props.onChange?.(value);
      });
    }
  };
}
