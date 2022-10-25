//Pagination request
export class QueryPage {
  constructor(
    public page: number = 0,
    public limit: number = 20
  ) {}

  public serialize(): string {
    const urlSearchParams: URLSearchParams = new URLSearchParams({
      page: String(this.page),
      limit: String(this.limit),
    } as Record<string, string>);
    return urlSearchParams.toString();
  }
}
