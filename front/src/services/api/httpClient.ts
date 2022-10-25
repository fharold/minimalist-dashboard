import Axios, {AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse} from "axios";
import {HttpClientUtils} from "../../utils/httpClientUtils";
import {ProgressListener} from "../../models/api/progressListener";
import {EntityResponse} from "../../models/api/entityResponse";
import {addInterceptors} from "./interceptors";
import {ImageResponse, ImageResponseHeaders} from "../../models/api/imageResponse";
import {Buffer} from 'buffer';
import {CookieUtils} from "../../utils/cookieUtils";

export const BASE_URL = process.env.REACT_APP_API_BASE_URL ? process.env.REACT_APP_API_BASE_URL : "missingApiBaseUrlConfig";

export class HttpClient {
  protected axios: AxiosInstance;

  protected static instance: HttpClient;

  public static getInstance(): HttpClient {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  public constructor() {
    if (BASE_URL === "missingApiBaseUrlConfig") {
      console.error("Missing REACT_APP_API_BASE_URL value in .env config");
    }
    this.axios = Axios.create({
      method: "GET",
      headers: {"Content-Type": "application/json"},
      baseURL: BASE_URL,
      timeout: 30000,
      maxContentLength: 1024 * 1024 * 50,
    });
    addInterceptors(this.axios);
  }

  public async get<EntityType, ResponseType extends EntityResponse<EntityType>>(
    endpoint: string
  ): Promise<ResponseType> {
    let response: AxiosResponse<ResponseType>;
    try {
      response = await this.axios.get(endpoint);
    } catch (error: unknown) {
      HttpClientUtils.handleAxiosException(error);
      return Promise.reject();
    }
    HttpClientUtils.handleAPIErrorIfNecessary(response);
    return response.data;
  }

  public async post<EntityType,
    ResponseType extends EntityResponse<EntityType>>(
    endpoint: string,
    data?: { [key: string]: string | number } | FormData,
    progressWatcher?: ProgressListener, headers?: AxiosRequestHeaders
  ): Promise<ResponseType> {
    const config: AxiosRequestConfig = {};
    if (data && data instanceof FormData) {
      config.onUploadProgress = progressWatcher;
      config.headers = headers
      config.timeout = 10 * 60 * 1000
    }

    let response: AxiosResponse<ResponseType> = await this.axios.post(endpoint, data, config);
    return response.data;
  }

  public async patch<EntityType,
    ResponseType extends EntityResponse<EntityType>>(
    endpoint: string,
    data?: { [key: string]: string | number } | FormData
  ): Promise<ResponseType> {
    let response: AxiosResponse<ResponseType>;
    try {
      response = await this.axios.patch(endpoint, data);
    } catch (error) {
      HttpClientUtils.handleAxiosException(error);
      return Promise.reject();
    }
    const apiResponse: ResponseType = response.data;
    if (!apiResponse.data) {
      HttpClientUtils.handleAPIErrorIfNecessary(response);
    }
    return apiResponse;
  }

  public async delete(
    endpoint: string,
    data?: { [key: string]: string | number | string[] } | FormData
  ): Promise<void> {
    let response: AxiosResponse<ResponseType>;
    try {
      response = await this.axios.delete(endpoint, {
        data: data,
      });
    } catch (error: unknown) {
      HttpClientUtils.handleAxiosException(error);
      return Promise.reject();
    }
    HttpClientUtils.handleAPIErrorIfNecessary(response);
    return;
  }

  public async loadBinary(endpoint: string): Promise<ImageResponse> {
    let response: AxiosResponse<ResponseType>;
    try {
      response = await this.axios.get(endpoint, {
        responseType: "arraybuffer",
      });
    } catch (error: unknown) {
      HttpClientUtils.handleAxiosException(error);
      return Promise.reject();
    }
    HttpClientUtils.handleAPIErrorIfNecessary(response);

    const headers: ImageResponseHeaders =
      response.headers as ImageResponseHeaders;

    return {
      data: Buffer.from(response.data, "binary"),
      contentType: headers["content-type"],
    };
  }

  /**
   * getRaw
   * @description Returns raw results from API
   * @param endpoint string
   */
  public async getRaw(url: string): Promise<any> {
    try {
      let token = CookieUtils.getToken().accessToken;
      let response = await this.axios.get(`${url}?token=${token}`, {
        // headers: {'Authorization': `Bearer ${token}`},
        responseType: 'blob'
      });
      return response.data;
    } catch (e) {
      console.error(e);
    }
  }

  // constructor(baseUrl: string) {
  //   this.axios = Axios.create({
  //     method: "post",
  //     headers: {"Content-Type": "application/json"},
  //     baseURL: baseUrl,
  //     timeout: 30000,
  //     maxContentLength: 1024 * 1024 * 50,
  //     withCredentials: true,
  //   });
  //
  //   configure({axios: this.axios});
  //
  //   this.axios.interceptors.response.use(
  //     //This is called for each request
  //     (response) => response,
  //     async (error) => {
  //       const {status, config} = error.response;
  //       if (getRequestedRoute(config.baseURL, config.url) === REFRESH) {
  //         //Refresh token isn't valid
  //         await this._authenticationService.logout(this, true, false);
  //         return;
  //       } else if (
  //         status === HTTPStatus.UNAUTHORIZED &&
  //         ![UserService.CHANGE_PASSWORD, LOGIN].includes(
  //           getRequestedRoute(config.baseURL, config.url)
  //         )
  //       ) {
  //         //If we are in login or changing pqss mode, no need to refreshing token.
  //         const res = await this._authenticationService.refreshAuth(this);
  //         if (res) {
  //           config.headers.Authorization = `Bearer ${res?.content.accessToken}`;
  //           return this.axios(config); //Replay the failed request
  //         }
  //       }
  //       throw error;
  //     }
  //   );
  // }
}
