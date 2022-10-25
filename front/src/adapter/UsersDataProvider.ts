import {DataProvider} from "../models/provider/DataProvider";
import {CustomerAPIPagination} from "./CustomerAPIPagination";
import {UserService} from "../services/userService";
import {PaginationController} from "../models/pagination/PaginationController";
import {User} from "../models/user";
import QueryFilter from "../models/api/queryFilter";

export default class UsersDataProvider extends DataProvider<User.DTO, CustomerAPIPagination>{
    private readonly _customerService: UserService;
    private readonly _type?: User.Role;
    private _referentUserId?: string;

    /**
     * constructor
     * @param customerService
     * @param type
     * @param referentUserId
     */
    public constructor(customerService: UserService, type?: User.Role, referentUserId?: string) {
        super(new PaginationController<CustomerAPIPagination>(new CustomerAPIPagination()));

        this._customerService = customerService;
        this._type = type;
        this._referentUserId = referentUserId;
    }

    set referentUserId(value: string | undefined) {
      this._referentUserId = value;
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

        if (this._type) filters.fields.role = this._type;
        if (this._referentUserId) filters.fields.referentUserId = this._referentUserId;

        const pageResponse = await this._customerService.getUsers(filters);
        pagination.updateWithPageResponse(pageResponse);

        this.notifySubscribers(pageResponse.data);

        return pageResponse.data;
    }
}