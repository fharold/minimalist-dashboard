import {EntityResponse} from "./entityResponse";

export interface MultipleEntityResponse<T> extends EntityResponse <T> {
  data: T[];
  count: number;
  limit: number;
  page: number;
  total: number;
}