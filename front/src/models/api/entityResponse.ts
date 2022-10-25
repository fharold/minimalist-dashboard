// this interface must only be used to be extended
export interface EntityResponse<T> {
  data: T | T[];
}