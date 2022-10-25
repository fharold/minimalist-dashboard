import {ViewBuilder} from "./ListAdapter";

export class Column<E> {
    displayKey: string;
    propertyName: string;
    view: ViewBuilder<E>;

    constructor(displayKey: string, propertyName: string, view: ViewBuilder<E>) {
        this.displayKey = displayKey;
        this.propertyName = propertyName;
        this.view = view;
    }
}