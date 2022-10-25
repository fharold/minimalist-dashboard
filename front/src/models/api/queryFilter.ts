import Sort from "../pagination/Sort";

export default class QueryFilter<T> {
  public fields: Partial<T>;
  public page: number;
  public size: number;
  public sort?: Sort;

  constructor(fields: Partial<T>, page?: number, size?: number, sort?: Sort) {
    this.fields = fields;
    this.page = page || 0;
    this.size = size || 10000;
    this.sort = sort;
  }

  /**
   * serialize
   */
  public serialize(): string {
    /**
     * remove undefined values
     */
    Object.keys(this.fields).forEach(key => {
      // @ts-ignore
      if (!this.fields[key]) delete this.fields[key]
    })

    let urlSearchParams = new URLSearchParams(this.fields as any);
    urlSearchParams.append('page', this.page.toString());
    urlSearchParams.append('size', this.size.toString());
    if (this.sort) {
      urlSearchParams.append('sort', `${this.sort.by},${this.sort.order.toString()}`);
    }

    return urlSearchParams.toString();
  }
}