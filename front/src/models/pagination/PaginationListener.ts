import {APIPagination} from "./APIPagination";

export interface PaginationListener<Pagination extends APIPagination> {
    onPaginationUpdate: (pagination: Pagination) => void;
}