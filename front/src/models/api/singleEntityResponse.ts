import {EntityResponse} from "./entityResponse";

export interface SingleEntityResponse<T> extends EntityResponse<T> {
  data: T;
}