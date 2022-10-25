import {DataProvider} from "../models/provider/DataProvider";
import {CustomerAPIPagination} from "./CustomerAPIPagination";
import {PaginationController} from "../models/pagination/PaginationController";
import QueryFilter from "../models/api/queryFilter";
import {Annotation} from "../models/annotation";
import {AnnotationService} from "../services/annotationService";

export default class AnnotationProvider extends DataProvider<Annotation.DTO, CustomerAPIPagination>{
    private readonly _annotationSvc: AnnotationService;
    private _equipment?: string;

    /**
     * constructor
     * @param annotationService
     * @param equipment
     */
    public constructor(annotationService: AnnotationService, equipment?: string) {
        super(new PaginationController<CustomerAPIPagination>(new CustomerAPIPagination()));

        this._annotationSvc = annotationService;
        this._equipment = equipment;
    }

    set equipment(value: string) {
      this._equipment = value;
      this.load();
    }

    /**
     * load
     * @returns {Promise<Annotation.DTO[]>}
     */
    async load() : Promise<Annotation.DTO[]> {
        const pagination = this._paginationController.pagination;

        const filters: QueryFilter<Annotation.DTO> = new QueryFilter({},
          pagination.page,
          pagination.limit,
          pagination.sort
        );

        if (this._equipment) filters.fields.equipment = this._equipment;

        let query = new QueryFilter<Partial<Annotation.DTO>>({
          equipment: this._equipment
        });

        const pageResponse = await this._annotationSvc.getAnnotations(query);
        pagination.updateWithPageResponse(pageResponse);

        this.notifySubscribers(pageResponse.data);

        return pageResponse.data;
    }
}