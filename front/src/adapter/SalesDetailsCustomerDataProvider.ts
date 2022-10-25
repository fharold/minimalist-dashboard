import {DataProvider} from "../models/provider/DataProvider";
import {CustomerAPIPagination} from "./CustomerAPIPagination";
import {UserService} from "../services/userService";
import {PaginationController} from "../models/pagination/PaginationController";
import {User} from "../models/user";
import QueryFilter from "../models/api/queryFilter";

export default class SalesDetailsCustomerDataProvider extends DataProvider<User.DTO, CustomerAPIPagination>{
    private readonly _customerService: UserService;
    private _referentId?: string;

    /**
     * constructor
     * @param customerService
     * @param referentId
     */
    public constructor(customerService: UserService, referentId?: string) {
        super(new PaginationController<CustomerAPIPagination>(new CustomerAPIPagination()));

        this._customerService = customerService;
        this._referentId = referentId;
    }

    set referentId(value: string) {
      this._referentId = value;
      this.load();
    }

    /**
     * load
     * @returns {Promise<User.DTO[]>}
     */
    async load() : Promise<User.DTO[]> {
        const pagination = this._paginationController.pagination;

        const filters: QueryFilter<User.DTO> = new QueryFilter({},
          pagination.page,
          pagination.limit,
          pagination.sort
        );

        if (this._referentId) filters.fields.referentUserId = this._referentId;
        else return [];

        const pageResponse = await this._customerService.getUsers(filters);
        pagination.updateWithPageResponse(pageResponse);

        this.notifySubscribers(pageResponse.data);

        return pageResponse.data;
    }
}