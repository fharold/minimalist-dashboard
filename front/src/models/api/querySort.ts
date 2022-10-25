export enum SORT_DIRECTION {
  ASC = "asc",
  DESC = "desc",
}

export class QuerySort {
  constructor(public fields: Record<string, SORT_DIRECTION>) {}

  public serialize(): string {
    //format for api is: orderby=property1=ASC,property2=DESC
    //orientation is uppercase
    const orderBy = Object.keys(this.fields).map(
      (key: string) => `${key}=${this.fields[key].toUpperCase()}`
    );

    const urlSearchParams: URLSearchParams = new URLSearchParams({
      orderBy: orderBy.join(","),
    });

    return urlSearchParams.toString();
  }
}
