import React from 'react';
import ListAdapter, {AdapterListener} from "./ListAdapter";
import Entity from "../../../models/pagination/Entity";
import {APIPagination} from "../../../models/pagination/APIPagination";

interface Props<E extends Entity, L extends AdapterListener<E>, P extends APIPagination> {
    entity: E,
    adapter: ListAdapter<E, L, P>
}

export default class ListRow<E extends Entity, L extends AdapterListener<E>, P extends APIPagination> extends React.Component<Props<E, L, P>, {}> {

    /**
     * render
     * @returns {any}
     */
    public render(): JSX.Element {
        const e = this.props.entity;
        const adapter = this.props.adapter;

        return <>{adapter.getColumns().map(col =>
            <td key={col.displayKey}>
                {adapter.getValue(e, col.displayKey)}
            </td>)}
        </>
    }

}