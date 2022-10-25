import {HttpClient} from "./httpClient";
import {SingleEntityResponse} from "../../models/api/singleEntityResponse";
import {QuerySort} from "../../models/api/querySort";
import {QueryPage} from "../../models/api/queryPage";
import {MultipleEntityResponse} from "../../models/api/multipleEntityResponse";
import {ProgressListener} from "../../models/api/progressListener";
import QueryFilter from "../../models/api/queryFilter";

export default class ApiService {
  public get httpClient(): HttpClient {
    return HttpClient.getInstance();
  }

  protected async getOne<T>(endpoint: string): Promise<T> {
    const data = await this.httpClient.get<T, SingleEntityResponse<T>>(
      endpoint
    );
    return data.data;
  }

  protected async getList<T>(
    endpoint: string,
    filters?: QueryFilter<Partial<T>>,
    sort?: QuerySort,
    page?: QueryPage
  ): Promise<MultipleEntityResponse<T>> {
    if (filters || sort || page) {
      endpoint = `${endpoint}?`;
    }

    if (filters) {
      endpoint += `${filters.serialize()}&`;
    }

    if (sort) {
      endpoint += `${sort.serialize()}&`;
    }

    if (page) {
      endpoint += `${page.serialize()}`;
    }

    return await this.httpClient.get<T, MultipleEntityResponse<T>>(endpoint);
  }

  protected async post<T>(
    endpoint: string,
    payload?: any,
    progressWatcher?: ProgressListener
  ): Promise<T> {
    const data = await this.httpClient.post<T, SingleEntityResponse<T>>(
      endpoint,
      payload,
      progressWatcher
    );
    return data.data;
  }

  protected async patch<T>(
    endpoint: string,
    payload?: any
  ): Promise<T> {
    const data = await this.httpClient.patch<T, SingleEntityResponse<T>>(
      endpoint,
      payload
    );
    return data.data;
  }

  protected async delete(
    endpoint: string,
    payload?: Record<string, string | string[]>
  ): Promise<void> {
    return await this.httpClient.delete(endpoint, payload);
  }


  protected async getFile(endpoint: string): Promise<File> {
    return await this.httpClient.getRaw(endpoint);
  }


  protected async getBlob(endpoint: string): Promise<Blob | undefined> {
    const data = await this.httpClient.getRaw(endpoint);
    return new Blob(data);
  }
}
