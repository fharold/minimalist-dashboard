import {DataProvider} from "../models/provider/DataProvider";
import {CustomerAPIPagination} from "./CustomerAPIPagination";
import {PaginationController} from "../models/pagination/PaginationController";
import QueryFilter from "../models/api/queryFilter";
import {Configuration} from "../models/configuration";
import {ConfigurationService} from "../services/configurationService";

export default class ConfigurationProvider extends DataProvider<Configuration.DTO, CustomerAPIPagination>{
    private readonly _cfgSvc: ConfigurationService;
    private _relatedCustomer?: string;

    /**
     * constructor
     * @param cfgSvc
     * @param relatedCustomer
     */
    public constructor(cfgSvc: ConfigurationService, relatedCustomer?: string) {
        super(new PaginationController<CustomerAPIPagination>(new CustomerAPIPagination()));

        this._cfgSvc = cfgSvc;
        this._relatedCustomer = relatedCustomer;
    }

    set relatedCustomer(value: string) {
      this._relatedCustomer = value;
      this.load();
    }

    /**
     * load
     * @returns {Promise<Configuration.DTO[]>}
     */
    async load() : Promise<Configuration.DTO[]> {
        const pagination = this._paginationController.pagination;

        const filters: QueryFilter<Configuration.DTO> = new QueryFilter({},
          pagination.page,
          pagination.limit,
          pagination.sort
        );

        if (this._relatedCustomer) filters.fields.relatedCustomer = this._relatedCustomer;

        const pageResponse = await this._cfgSvc.getConfigurations(undefined, false, filters);
        pagination.updateWithPageResponse(pageResponse);

        this.notifySubscribers(pageResponse.data);

        return pageResponse.data;
    }
}