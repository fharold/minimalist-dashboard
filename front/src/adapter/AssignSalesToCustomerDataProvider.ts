import {DataProvider} from "../models/provider/DataProvider";
import {CustomerAPIPagination} from "./CustomerAPIPagination";
import {UserService} from "../services/userService";
import {PaginationController} from "../models/pagination/PaginationController";
import {User} from "../models/user";
import QueryFilter from "../models/api/queryFilter";

export default class AssignSalesToCustomerDataProvider extends DataProvider<User.DTO, CustomerAPIPagination>{
  private readonly _customerService: UserService;

  /**
   * constructor
   * @param customerService
   */
  public constructor(customerService: UserService) {
    super(new PaginationController<CustomerAPIPagination>(new CustomerAPIPagination()));

    this._customerService = customerService;
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

    filters.fields.role = User.Role.SALES_REP;

    const pageResponse = await this._customerService.getUsers(filters);
    pagination.updateWithPageResponse(pageResponse);

    this.notifySubscribers(pageResponse.data);

    return pageResponse.data;
  }
}