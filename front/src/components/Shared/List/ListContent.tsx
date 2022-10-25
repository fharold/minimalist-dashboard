import React from 'react';
import ListAdapter, {AdapterListener, ListWatcher} from './ListAdapter';
import ListRow from 'components/Shared/List/ListRow';
import {Column} from 'components/Shared/List/Column';
import Entity from 'models/pagination/Entity';
import {APIPagination} from 'models/pagination/APIPagination';
import {Order} from 'models/pagination/Sort';
// import Skeleton, {SKELETON_TYPE} from 'components/Shared/Skeleton';
import Spinner from 'components/Shared/Spinner';


interface Props<E extends Entity, L extends AdapterListener<E>, P extends APIPagination> {
  adapter: ListAdapter<E, L, P>;
}

interface State {
}

export default class ListContent<E extends Entity, L extends AdapterListener<E>, P extends APIPagination> extends React.Component<Props<E, L, P>, State> implements ListWatcher {

  /**
   * componentDidMount
   */
  public componentDidMount(): void {
    super.componentDidMount && super.componentDidMount();
    this.props.adapter.addListWatcher(this);
  }

  /**
   * componentWillUnmount
   */
  public componentWillUnmount(): void {
    super.componentWillUnmount && super.componentWillUnmount();
    this.props.adapter.removeListWatcher(this);
  }

  /**
   * onUpdate
   */
  public onUpdate = (): void => {
    this.forceUpdate();
  };

  /**
   * _sortIcon
   * @private
   */
  private _sortIcon = (props: { column: Column<E> }): JSX.Element => {
    const {adapter} = this.props;

    const sort = adapter.getSort();
    if (!sort || (sort && sort.by !== props.column.propertyName)) {
      return <></>;
    }

    return <span className="icon">{sort.order === Order.ASC ? " ▴" : " ▾"}</span>
  };

  /**
   * render
   */
  public render(): JSX.Element {
    const {adapter} = this.props;
    let key = 0;

    return (
      <table>
        <thead>
        <tr>
          {adapter.getColumns().map(column =>
            <th className={'table-header section-title'} key={column.displayKey} onClick={() => adapter.setSort(column.propertyName)}>
              {column.displayKey}
              <this._sortIcon column={column}/>
            </th>)}
        </tr>
        </thead>
        <tbody>
        {adapter.getCount() > 0 ?

          adapter.getItems().map(item =>
            <tr key={key++} className={'list-element'} onClick={() => adapter.itemClicked(item)}>
              <ListRow entity={item} adapter={adapter}/>
            </tr>
          )

          : // no data

          <tr>
            {adapter.loading ?
              // adapter.getColumns().map(() => <td><Skeleton type={SKELETON_TYPE.USER_LIST_COLUMN}/></td>)
              <td colSpan={adapter.getColumns().length}><Spinner inlined={true}/></td>
              :
              <td colSpan={adapter.getColumns().length}><p className={'list-item'}>{adapter.getEmptyListPlaceholder()}</p></td>
            }
          </tr>
        }
        </tbody>
      </table>
    );
  }
}