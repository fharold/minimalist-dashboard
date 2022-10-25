import React from "react";
import {User} from "../models/user";
import ListAdapter, {AdapterListener} from "../components/Shared/List/ListAdapter";
import {CustomerAPIPagination} from "./CustomerAPIPagination";
import {Column} from "../components/Shared/List/Column";
import UsersDataProvider from "./UsersDataProvider";
import CustomerProfile = User.CustomerProfile;
import {TFunction} from "i18next";

export interface UserAdapterListener extends AdapterListener<User.DTO> {
  removeClicked: (user: User.DTO) => void;
}

export default class UserAdapter extends ListAdapter<User.DTO, UserAdapterListener, CustomerAPIPagination> {
  private _showRemove: boolean | undefined;

  /**
   * constructor
   * @param t
   * @param customersProvider
   * @param listener
   * @param showRemove
   */
  constructor(t: TFunction, customersProvider: UsersDataProvider, listener?: UserAdapterListener, showRemove?: boolean) {
    super(t);

    this.addColumn(new Column(t('usersListColName'), "lastName", this._name));
    this.addColumn(new Column(t('usersListColEnabled'), "enabled", this._enabled));
    this.addColumn(new Column(t('usersListColStatus'), "status", this._status));
    this.addColumn(new Column(t('usersListColHatchery'), "hatchery", this._hatchery));
    this.addColumn(new Column(t('usersListColCompany'), "company", this._company));
    this.addColumn(new Column(t('usersListColConfigurations'), "configCount", this._configCount));
    this.addColumn(new Column('', "actions", this._actions));

    this.init(
      "customerListEmpty",
      customersProvider,
      [],
      listener
    );

    this._showRemove = showRemove;

    this.criteria.unshift({
      relatedFilterKey: CustomerAPIPagination.GRANT_TYPE_FILTER,
      translationKey: "all",
      value: "all"
    });
  }

  /**
   * _id
   * @returns {any}
   * @private
   * @param customer
   */
  private _id = (customer: User.DTO): JSX.Element => {
    return <p className={"blue-hover"}>{customer.id}</p>
  };

  /**
   * _firstName
   * @returns {any}
   * @private
   * @param customer
   */
  private _name = (customer: User.DTO): JSX.Element => {
    return <p className={"blue-hover"}>{customer.lastName + ' ' + customer.firstName}</p>
  };

  /**
   * _enabled
   * @returns {any}
   * @private
   * @param customer
   */
  private _enabled = (customer: User.DTO): JSX.Element => {
    return <input type="checkbox" readOnly checked={customer.status === User.Status.ENABLED}/>
  };

  /**
   * _status
   * @returns {any}
   * @private
   * @param customer
   */
  private _status = (customer: User.DTO): JSX.Element => {
    if (!customer.expireAt || customer.expireAt === 0) return <p style={{color: 'green'}}>{this._t('userAdapterStatusNeverExpires')}</p>

    let now = Date.now() / 1000;
    let diff = customer.expireAt - now;
    if (diff <= 0) {
      return <p style={{color: 'red'}}>{this._t('userAdapterStatusExpired')}</p>
    } else {
      let remainingDays = Math.ceil(diff / 60 /*s*/ / 60 /*mn*/ / 24 /*h*/);
      console.log(diff, remainingDays);
      return <p style={{color: 'green'}}>{this._t('userAdapterXDaysLeft', {days: remainingDays})}</p>
    }
  };

  /**
   * _hatchery
   * @returns {any}
   * @private
   * @param customer
   */
  private _hatchery = (customer: User.DTO): JSX.Element => {
    return <p>{(customer.profile as CustomerProfile | undefined)?.hatchery || "N/A"}</p>
  };

  /**
   * _company
   * @returns {any}
   * @private
   * @param customer
   */
  private _company = (customer: User.DTO): JSX.Element => {
    return <p>{(customer.profile as CustomerProfile | undefined)?.company || "N/A"}</p>
  };

  /**
   * _configCount
   * @returns {any}
   * @private
   * @param customer
   */
  private _configCount = (customer: User.DTO): JSX.Element => {
    return <p>123</p>
  };

  /**
   * _actions
   * @returns {any}
   * @private
   * @param customer
   */
  private _actions = (customer: User.DTO): JSX.Element => {
    return <p><span className={'button secondary'}>{this._t('userAdapterEditAction')}</span><span> </span>{this._showRemove &&
      <span onClick={(e) => {
        e.stopPropagation();
        this._listener?.removeClicked(customer);
      }} className={'button secondary'}>{this._t('userAdapterRemoveAction')}</span>}</p>
  };
}