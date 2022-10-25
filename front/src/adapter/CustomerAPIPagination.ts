import {APIPagination} from "../models/pagination/APIPagination";
import {Criterion} from "../models/pagination/Criterion";

export class CustomerAPIPagination extends APIPagination {
    static GRANT_TYPE_FILTER = "grantType";

    public grantType?: string

    /**
     * setCriterion
     * @param criterion
     * @returns {undefined}
     */
    public setCriterion(criterion: Criterion<any>): void {
        switch (criterion.relatedFilterKey) {
            case CustomerAPIPagination.GRANT_TYPE_FILTER:
                if (criterion.value === "all") this.grantType = undefined;
                else this.grantType = criterion.value.toUpperCase()
                break;
        }

        super.setCriterion(criterion);
    }
}