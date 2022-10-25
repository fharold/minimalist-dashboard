import {Criterion} from "./Criterion";
import {PaginationFilters} from "./PaginationFilters";

export interface Filter extends PaginationFilters {
    criteria?: Criterion<any>[];
    name?: string;
}