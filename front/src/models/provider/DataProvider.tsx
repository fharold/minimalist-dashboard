import {APIPagination} from "../pagination/APIPagination";
import {PaginationController} from "../pagination/PaginationController";
import {PaginationListener} from "../pagination/PaginationListener";
import Entity from "../pagination/Entity";

export interface DataProviderListener<E> {
    onUpdate: (dataset: E[]) => void;
}

export abstract class DataProvider<E extends Entity, P extends APIPagination> implements PaginationListener<P> {
    protected _paginationController: PaginationController<P>;
    private _subscribers: DataProviderListener<E>[] = [];
    private _loading: boolean = false;

    /**
     * constructor
     * @param paginationController
     */
    protected constructor(paginationController: PaginationController<P>) {
        this._paginationController = paginationController;
        this._paginationController.addListener(this);
    }

    /**
     * paginationController
     * @returns {PaginationController<P>}
     */
    public get paginationController(): PaginationController<P> {
        return this._paginationController;
    }

    /**
     * subscribe
     * @param l
     */
    public subscribe(l: DataProviderListener<E>): void {
        if (this._subscribers.indexOf(l) < 0) this._subscribers.push(l)
    }

    /**
     * unsubscribe
     * @param l
     */
    public unsubscribe(l: DataProviderListener<E>) {
        const index = this._subscribers.indexOf(l);

        if (index > 0) this._subscribers.splice(index, 1)
    }

    /**
     * notifySubscribers
     */
    protected notifySubscribers = (dataset: E[]) => {
        this._subscribers.forEach(sub => sub.onUpdate(dataset))
    };

    /**
     * loading
     * @returns {boolean}
     */
    public get loading(): boolean {
        return this._loading;
    }

    /**
     * load
     */
    abstract load(): Promise<E[]>;

    /**
     * onPaginationUpdate
     * @param pagination
     */
    public async onPaginationUpdate(pagination: APIPagination): Promise<void> {
        if (this._loading) return;

        this._loading = true;
        await this.load();
        this._loading = false;
    }
}