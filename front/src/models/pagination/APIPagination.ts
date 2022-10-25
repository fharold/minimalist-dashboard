import {MultipleEntityResponse} from "../api/multipleEntityResponse";
import Sort, {Order} from "./Sort";
import {Criterion} from "./Criterion";

export abstract class APIPagination {
    onPaginationUpdate?: () => void;

    page: number;
    limit: number;
    count: number;
    total: number;
    searchQuery?: string;
    sort?: Sort;

    constructor(page: number = 0, limit: number = 20, count: number = 0, total: number = 0, searchQuery?: string, sort?: Sort) {
        this.page = page;
        this.limit = limit;
        this.count = count;
        this.total = total;
        this.searchQuery = searchQuery;
    }

    /**
     * fromPageResponse
     * @param pageResponse
     * @returns {APIPagination}
     */
    static fromPageResponse(pageResponse: MultipleEntityResponse<any>): APIPagination {
        return new DefaultAPIPagination(pageResponse.page, pageResponse.limit, pageResponse.count, pageResponse.total);
    }

    /**
     * setSort
     * @param by
     */
    public setSort(by: string) {
        if (!this.sort || this.sort.by !== by) this.sort = new Sort(Order.ASC, by);
        else if (this.sort) this.sort.order = this.sort.order === Order.ASC ? Order.DESC : Order.ASC;

        this.onPaginationUpdate?.()
    }

    /**
     * setPageQuery
     * @param query
     */
    public setPageQuery(query?: string) {
        this.searchQuery = query;
        this.onPaginationUpdate?.();
    }

    /**
     * setCriterion
     * @param criterion
     */
    public setCriterion(criterion: Criterion<any>) {
        this.onPaginationUpdate?.();
    };

    /**
     * updateWithPageResponse
     * @param pageResponse
     */
    public updateWithPageResponse(pageResponse: MultipleEntityResponse<any>) {
        this.page = pageResponse.page;
        this.count = pageResponse.count;
        this.limit = pageResponse.limit;
        this.total = pageResponse.total;

        this.onPaginationUpdate?.();
    }

    /**
     * pageCount
     * @returns {number}
     */
    get pageCount(): number {
        return Math.ceil(this.total / this.limit);
    }
}

export class DefaultAPIPagination extends APIPagination {}
