import React from "react";
import {Column} from "./Column";
import Sort from "../../../models/pagination/Sort";
import Entity from "../../../models/pagination/Entity";
import {APIPagination} from "../../../models/pagination/APIPagination";
import {Criterion} from "../../../models/pagination/Criterion";
import {DataProvider, DataProviderListener} from "../../../models/provider/DataProvider";
import {TFunction} from "i18next";

export type ValueAccessor = (obj: any) => JSX.Element;

export interface AdapterListener<E> {
    rowSelected(obj: E): void;
}

export type ViewBuilder<E> = (obj: E) => JSX.Element

export interface ListWatcher {
    onUpdate(): void;
}

export default class ListAdapter<E extends Entity, L extends AdapterListener<E>, P extends APIPagination> implements DataProviderListener<E> {
    protected _listener?: L;
    protected _t: TFunction;
    private _columnsValueMapping: Array<Column<E>> = [];
    private _data: E[] = [];
    private _emptyListPlaceholder: string = "";
    private _listWatchers: Array<ListWatcher> = [];
    private _sort?: Sort = undefined;
    private _dataProvider?: DataProvider<E, P>;
    private _loading: boolean = false;
    private _criteria : Array<Criterion<any>> = [];

    constructor(t: TFunction) {
      this._t = t;
    }

    /**
     * getColumns returns columns names
     * @returns {string[]}
     */
    public getColumns(): Column<E>[] {
        return this._columnsValueMapping;
    }

    /**
     * addColumn
     * @param newColumn
     */
    public addColumn(newColumn: Column<E>) {
        if (!this._columnsValueMapping.find(column => column.displayKey === newColumn.displayKey)) {
            this._columnsValueMapping.push(newColumn);
        }
    }

    /**
     * criteria
     * @returns {Array<Criterion>}
     */
    public get criteria() : Array<Criterion<any>> {
        return this._criteria;
    }

    /**
     * addListener
     * @param watcher
     */
    public addListWatcher(watcher: ListWatcher) {
        const index = this._listWatchers.indexOf(watcher);
        if (index < 0) {
            this._listWatchers.push(watcher)
        }
    }

    /**
     * removeListener
     * @param watcher
     */
    public removeListWatcher(watcher: ListWatcher) {
        const index = this._listWatchers.indexOf(watcher);

        if (index > 0) {
            this._listWatchers.splice(index, 1)
        }
    }

    public set listener(l: L) {
        this._listener = l;
    }

    /**
     * getItems
     * @returns {E[]}
     */
    public getItems(): E[] {
        return this._data;
    }

    /**
     * getCount
     * @returns {number}
     */
    public getCount(): number {
        return this._data.length;
    }

    /**
     * setSort
     * @param column
     */
    public setSort(column: string) {
        this._dataProvider?.paginationController.pagination.setSort(column)
    }

    /**
     * getSort
     * @returns {Sort | undefined}
     */
    public getSort(): Sort | undefined {
        return this._dataProvider?.paginationController.pagination.sort
    }

    /**
     * getEmptyListPlaceholder
     * @returns {string}
     */
    public getEmptyListPlaceholder(): string {
        return this._emptyListPlaceholder;
    }

    /**
     * getValue
     * @param entity
     * @param displayKey
     * @returns {JSX.Element | any}
     */
    public getValue(entity: E, displayKey: string): JSX.Element {
        const colMapping = this._columnsValueMapping.find(col => col.displayKey === displayKey);

        if (!colMapping) {
            return <></>;
        }

        return colMapping.view(entity);
    }

    public onUpdate = (dataset: E[]) => {
        this._data = dataset;
        this._notifyListWatchers();
    };

    /**
     * itemClicked
     * @param item
     */
    public itemClicked(item: E) {
        this._listener?.rowSelected?.(item);
    }

    /**
     * init
     * @param emptyListPlaceholder
     * @param dataProvider
     * @param listener
     * @param criteria
     */
    protected init(emptyListPlaceholder: string, dataProvider: DataProvider<E, P>, criteria: Array<Criterion<any>>, listener?: L): void {
        this._emptyListPlaceholder = emptyListPlaceholder;
        this._data = [];

        this._criteria.push(...criteria);

        this._listener = listener;
        this._dataProvider = dataProvider;
        this._dataProvider.subscribe(this);

        this._fetchDataset();
    }

    /**
     * _fetchDataset
     * @private
     */
    private _fetchDataset = () => {
        this._loading = true;
        this._notifyListWatchers();
        this._dataProvider?.load().then(dataset => {
            this._data = dataset;
            this._notifyListWatchers();
        })
            .catch(e => {
                console.error("_fetchDataset", e);
            })
            .finally(() => {
                this._loading = false;
                this._notifyListWatchers();
            })
    };

    /**
     * loading
     * @returns {boolean}
     */
    public get loading(): boolean {
        return this._loading;
    }

    /**
     * notifyListWatchers
     */
    private _notifyListWatchers = () => {
        this._listWatchers.forEach(watcher => watcher.onUpdate());
    };
}