import {APIPagination} from "./APIPagination";
import {PaginationListener} from "./PaginationListener";

export class PaginationController<Pagination extends APIPagination> {
    private _pagination: Pagination
    private _listeners: PaginationListener<Pagination>[] = [];

    /**
     * pagination
     * @returns {Pagination}
     */
    public get pagination(): Pagination {
        return this._pagination;
    }

    public setPage = (pageNb: number) => {
        this._pagination.page = pageNb;
        this.notifyListeners();
    };

    /**
     * addListener
     * @param l
     */
    public addListener = (l: PaginationListener<Pagination>) => {
        this._listeners.push(l);
    };

    /**
     * removeListener
     * @param l
     */
    public removeListener = (l: PaginationListener<Pagination>) => {
        this._listeners.splice(this._listeners.indexOf(l), 1);
    }

    /**
     * notifyListeners
     */
    public notifyListeners = () => {
        this._listeners.forEach(l => l.onPaginationUpdate(this.pagination));
    }

    /**
     * constructor
     * @param pagination
     */
    constructor(pagination: Pagination) {
        this._pagination = pagination;
        this._pagination.onPaginationUpdate = this.notifyListeners;
    }
}