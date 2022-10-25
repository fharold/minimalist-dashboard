import React from "react";
import {User} from "../models/user";
import ListAdapter, {AdapterListener} from "../components/Shared/List/ListAdapter";
import {CustomerAPIPagination} from "./CustomerAPIPagination";
import {Column} from "../components/Shared/List/Column";
import SalesDetailsCustomerDataProvider from "./SalesDetailsCustomerDataProvider";
import {TFunction} from "i18next";

export interface SalesDetailsCustomerAdapterListener extends AdapterListener<User.DTO> {
}

export default class SalesDetailsCustomerAdapter extends ListAdapter<User.DTO, SalesDetailsCustomerAdapterListener, CustomerAPIPagination> {

  /**
   * constructor
   * @param customersProvider
   * @param listener
   * @param t
   */
  constructor(t: TFunction, customersProvider: SalesDetailsCustomerDataProvider, listener?: SalesDetailsCustomerAdapterListener) {
    super(t);

    this.addColumn(new Column(t('salesDetailsPageAdapterColName'), "lastName", this._name));
    this.addColumn(new Column(t('salesDetailsPageAdapterColEnabled'), "enabled", this._enabled));
    this.addColumn(new Column(t('salesDetailsPageAdapterColStatus'), "status", this._status));
    this.addColumn(new Column(t('salesDetailsPageAdapterColConfigurations'), "configCount", this._configCount));
    this.addColumn(new Column('', "actions", this._actions));

    this.init(
      t('salesDetailsPageAdapterCustomerListEmpty'),
      customersProvider,
      [],
      listener
    );

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
    return <p><span className={'button secondary'}>{this._t('salesDetailsCustomerAdapterEditAction')}</span><span> </span><span className={'button secondary'}>{this._t('salesDetailsCustomerAdapterRemoveAction')}</span></p>
  };
}