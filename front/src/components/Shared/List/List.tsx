import React from "react";
import ListAdapter, {AdapterListener} from "./ListAdapter";
import ListContent from "./ListContent";
import ListToolbar from "./ListToolbar";
import Entity from "../../../models/pagination/Entity";
import {APIPagination} from "../../../models/pagination/APIPagination";
import {DataProvider} from "../../../models/provider/DataProvider";
import {Criterion} from "../../../models/pagination/Criterion";
import FiltersComponent from "./FiltersComponent";
import ButtonProps from "../Button/ButtonProps";


interface Props<E extends Entity, L extends AdapterListener<E>, P extends APIPagination> {
  adapter: ListAdapter<E, L, P>
  dataProvider: DataProvider<E, P>
  onAddClick?: () => void;
  accessoryButton?: ButtonProps;
}

export default class List<E extends Entity, L extends AdapterListener<E>, P extends APIPagination> extends React.Component<Props<E, L, P>, any> {

  /**
   * _applyFilter
   * @param criterion
   * @private
   */
  private _applyFilter = (criterion: Criterion<any>) => {
    const pagination = this.props.dataProvider.paginationController.pagination;

    pagination.setCriterion(criterion);
  };

  private _onSearchQueryUpdated = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    const pagination = this.props.dataProvider.paginationController.pagination;
    pagination.setPageQuery(trimmedQuery.length === 0 ? undefined : trimmedQuery)
  }

  /**
   * render
   * @returns {any}
   */
  public render(): any {
    const {adapter, accessoryButton, dataProvider, onAddClick} = this.props;

    return <div className={"list"}>
      {/*<ListToolbar*/}
      {/*  paginationController={dataProvider.paginationController}*/}
      {/*  onAddClick={onAddClick}*/}
      {/*  accessoryButton={accessoryButton}*/}
      {/*  onSearchQueryUpdated={this._onSearchQueryUpdated}/>*/}
      <ListContent adapter={adapter}/>
    </div>

  }
}