import React from "react";
import {User} from "../models/user";
import ListAdapter, {AdapterListener} from "../components/Shared/List/ListAdapter";
import {CustomerAPIPagination} from "./CustomerAPIPagination";
import {Column} from "../components/Shared/List/Column";
import AssignSalesToCustomerDataProvider from "./AssignSalesToCustomerDataProvider";
import {TFunction} from "i18next";

export default class AssignSalesToCustomerAdapter extends ListAdapter<User.DTO, AdapterListener<User.DTO>, CustomerAPIPagination> {

  /**
   * constructor
   * @param customersProvider
   * @param listener
   * @param t
   */
  constructor(t: TFunction, customersProvider: AssignSalesToCustomerDataProvider, listener?: AdapterListener<User.DTO>) {
    super(t);

    this.addColumn(new Column('Name', "lastName", this._name));

    this.init(
      "customerListEmpty",
      customersProvider,
      [],
      listener
    );
  }

  /**
   * _firstName
   * @returns {any}
   * @private
   * @param customer
   */
  private _name = (customer: User.DTO): JSX.Element => {
    return <p className={"blue-hover"}>{User.prettyName(customer)}</p>
  };
}