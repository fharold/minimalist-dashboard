import React from "react";
import "./ConfigElemInput.scss"
import {InputState} from "./TextInput";
import {InputValidator} from "../../utils/Form/InputValidator";
import {Input} from "../../utils/Form/Input";
import {Equipment} from "../../models/equipment";
import {ServiceRepository} from "../../services/serviceRepository";
import QueryFilter from "../../models/api/queryFilter";
import {Configuration, Room} from "../../models/configuration";

export interface ConfigElemProps extends Input<string[]> {
  label: string,
  room: Room
}

interface ConfigElemState extends InputState<string[]> {
  equipments: Equipment.DTO[]
}

export default class ConfigElemInput extends React.Component<ConfigElemProps, ConfigElemState> implements InputValidator<string[]> {
  constructor(props: ConfigElemProps, state: InputState<string[]>) {
    super(props, state);

    this.state = {
      error: 0,
      equipments: [],
      value: props.defaultValue
    }
  }

  componentDidMount() {
    ServiceRepository.getInstance().equipmentSvc.listEquipments().then(equipments => this.setState({
      value: this.props.defaultValue,
      equipments: equipments.data
    }));
  }

  componentDidUpdate(prevProps: Readonly<ConfigElemProps>, prevState: Readonly<ConfigElemState>, snapshot?: any) {
    super.componentDidUpdate?.(prevProps, prevState, snapshot);
    if (prevProps.defaultValue?.length !== this.props.defaultValue?.length) {
      ServiceRepository.getInstance().equipmentSvc.listEquipments().then(equipments => this.setState({
        value: this.props.defaultValue,
        equipments: equipments.data
      }));
    }
  }

  public checkValidity(): boolean {
    const isValid = this.props.validation?.(this.state.value) || !this.props.validation;

    this.setState({
      error: isValid ? 0 : 422
    })

    return isValid;
  }

  private _valueUpdated = (value: string[]) => {
    const isValid = this.props.validation?.(value) || !this.props.validation;
    this.setState({
      value: value,
      error: isValid ? 0 : 422
    }, () => {
      this.props.onChange?.(value);
    })
  }

  toggleItem(equipKey: string) {
    let newValue: string[] = Object.assign([], this.state.value);
    let index = newValue.indexOf(equipKey);
    if (index < 0) {
      newValue.push(equipKey);
    } else {
      newValue.splice(index, 1);
    }

    this.setState({
      value: newValue
    });
  }

  render() {
    if (!this.state) return <p>null state</p>

    //Selected items
    const value = this.state.value;

    return <>
      {
        this.state.equipments?.map(equipment => {
          const isEnabled = !!value?.find(value1 => value1 === equipment.key);
          return <div
            key={equipment.key}
            className={`config-elem-container ${isEnabled ? 'enabled' : 'disabled'}`}
            onClick={() => this.toggleItem(equipment.key)}>
            <p>{equipment.name}</p>
            <img src={isEnabled ? '/assets/img/icon_close.png' : '/assets/img/icon_add.png'} alt={"checkbox"}/>
          </div>
        })
      }
    </>;
  }

  getValue(): string[] | undefined {
    return this.state.value;
  }

  id(): string {
    return this.props.id;
  }
}
