import React from "react";
import Entity from "../../../models/pagination/Entity";
import {APIPagination} from "../../../models/pagination/APIPagination";
import {PaginationController} from "../../../models/pagination/PaginationController";
import {PaginationListener} from "../../../models/pagination/PaginationListener";
import Colors from "../Button/Colors";

interface Props<P extends APIPagination> {
  paginationController: PaginationController<P>;
}

interface State {
}

export default class PaginationComponent<E extends Entity, P extends APIPagination>
  extends React.Component<Props<P>, State>
  implements PaginationListener<P> {

  /**
   * onUpdate
   */
  public onUpdate = () => {
    this.forceUpdate();
  };

  /**
   * componentDidMount
   */
  public componentDidMount(): void {
    if (super.componentDidMount) super.componentDidMount();
    this.props.paginationController.addListener(this);
  }


  /**
   * componentWillUnmount
   */
  public componentWillUnmount(): void {
    if (super.componentWillUnmount) super.componentWillUnmount();
    this.props.paginationController.removeListener(this);
  }

  /**
   * _handlePreviousClick
   */
  private _handlePreviousClick = () => {
    const {page} = this.props.paginationController.pagination;

    if (page === 0) {
      return;
    }

    this._dispatchPageUpdate(0);
  };

  /**
   * _handleForwardClick
   */
  private _handleForwardClick = () => {
    const {page, pageCount} = this.props.paginationController.pagination;

    if (page === pageCount - 1) {
      return;
    }

    this._dispatchPageUpdate(pageCount - 1);
  };

  /**
   * _handleBtnClick
   */
  private _handleBtnClick = (pageNb: number) => {
    this._dispatchPageUpdate(pageNb);
  };

  /**
   * _dispatchPageUpdate
   * @param pageNb
   */
  private _dispatchPageUpdate = this.props.paginationController.setPage;

  /**
   * onPaginationUpdate
   * @param pagination
   */
  onPaginationUpdate(pagination: APIPagination): void {
    this.forceUpdate();
  }

  /**
   * render
   */
  public render = () => {
    const {page, pageCount, total, count} = this.props.paginationController.pagination;
    const items = [];

    for (let i = 0; i < pageCount; i++) {
      const nbBtns = 2;
      const isSelected = i === page;

      if ((i < nbBtns && page <= nbBtns)
        || i === page
        || (i >= (page - nbBtns) && (i <= (page + nbBtns)))) {
        items.push(<button key={i} className={"select-item"} value={i}
                           style={{
                             borderColor: Colors.blue.bg,
                             color: isSelected ? Colors.blue.fg : Colors.blue.bg,
                             backgroundColor: isSelected ? Colors.blue.bg : Colors.blue.fg
                           }}
                           onClick={() => this._handleBtnClick(i)}>{`${i + 1}`}</button>)
      }
    }

    return <div className={"pagination-component"}>
      <div className={"form-select"}>
        <button className={"select-item"}
                style={{borderColor: Colors.blue.bg, color: Colors.blue.bg, backgroundColor: Colors.blue.fg}}
                onClick={this._handlePreviousClick}>{"<"}</button>
        {items}
        <button className={"select-item"}
                style={{borderColor: Colors.blue.bg, color: Colors.blue.bg, backgroundColor: Colors.blue.fg}}
                onClick={this._handleForwardClick}>{">"}</button>
      </div>
      <p className={"label-total"}>{`this.t.pageTotal ${count}/${total}`}</p>
    </div>;
  }
}