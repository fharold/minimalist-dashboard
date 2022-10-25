import ApiService from "./api/apiService";
import {QuerySort} from "../models/api/querySort";
import {QueryPage} from "../models/api/queryPage";
import {MultipleEntityResponse} from "../models/api/multipleEntityResponse";
import {URLs} from "../utils/urls";
import {generatePath} from "react-router-dom";
import QueryFilter from "../models/api/queryFilter";
import {Annotation} from "../models/annotation";

export class AnnotationService extends ApiService {
  public async createAnnotation(data: Partial<Annotation.DTO>): Promise<Annotation.DTO> {
    return await this.post(URLs.API.ANNOTATIONS, data)
  }

  public async editAnnotation(annotationId: string, data: Partial<Annotation.DTO>): Promise<Annotation.DTO> {
    let url = generatePath(URLs.API.ANNOTATION, {
      annotationId: annotationId
    });

    return await this.patch(url, data)
  }

  public async getAnnotations(
    filters?: QueryFilter<Partial<Annotation.DTO>>,
    sort?: QuerySort,
    page?: QueryPage
  ): Promise<MultipleEntityResponse<Annotation.DTO>> {
    if (!filters) {
      filters = new QueryFilter<Partial<Annotation.DTO>>({});
    }

    return this.getList(URLs.API.ANNOTATIONS, filters, sort, page);
  }

  public async getAnnotation(annotationId: string): Promise<Annotation.DTO> {
    let url = generatePath(URLs.API.ANNOTATION, {
      annotationId: annotationId
    });

    return this.getOne(url);
  }

  public async removeAnnotation(annotationId: string): Promise<void> {
    let url = generatePath(URLs.API.ANNOTATION, {
      annotationId: annotationId
    });

    return this.delete(url);
  }
}