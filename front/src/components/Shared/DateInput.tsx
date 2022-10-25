import React from "react";
import "./FileInput.scss"
import {InputValidator} from "../../utils/Form/InputValidator";
import {Input} from "../../utils/Form/Input";
import {DateUtils} from "../../utils/DateUtils";

export interface DateInputProps extends Input<number> {
  placeholder: string,
}

export interface InputState<InputType> {
  value?: InputType;
  error: number;
}

export default class DateInput extends React.Component<DateInputProps, InputState<number>> implements InputValidator<number> {
  constructor(props: DateInputProps, state: InputState<number>) {
    super(props, state);

    this.state = {
      error: 0,
      value: props.defaultValue
    }
  }

  componentDidUpdate(prevProps: Readonly<DateInputProps>, prevState: Readonly<InputState<number>>, snapshot?: any) {
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

  private _valueUpdated = (value: number) => {
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
    const {readonly, placeholder} = this.props;

    const twoWeeksInSeconds = (3600 * 24 * 14);
    let date = !value ? new Date((DateUtils.now() + twoWeeksInSeconds) * 1000) : new Date(value * 1000);
    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    let formattedDate = year + "-" + month + "-" + day;

    return <>
      <input type={"date"} placeholder={placeholder}
             readOnly={readonly}
             value={formattedDate}
             onChange={event => {
               this._valueUpdated(Date.parse(event.target.value) / 1000)
             }}/>
      {error > 0 && <p>error</p>}
    </>;
  }

  getValue(): number | undefined {
    return this.state.value;
  }

  id(): string {
    return this.props.id;
  }
}
