import {AccessTokenDTO} from "../models/accessTokenDTO";
import {CookieUtils} from "../utils/cookieUtils";
import {SingleEntityResponse} from "../models/api/singleEntityResponse";
import ApiService from "./api/apiService";
import {URLs} from "../utils/urls";

export class AuthService extends ApiService {
  private _accessToken : string | undefined = undefined;

  constructor() {
    super();

    try {
      this._accessToken = CookieUtils.getToken().accessToken;
    } catch (e) {
      //nothing to do on catch. Still need to initialize service.
    }
  }


  public get accessToken() : string | undefined {
    return this._accessToken;
  }

  public login = async (username: string, password: string): Promise<void> => {
    const response: AccessTokenDTO = await this.post<AccessTokenDTO>(
      URLs.API.LOGIN,
      {
        email: username,
        password: password,
      }
    );

    console.log("got response : ", response);

    this._accessToken = response.accessToken;
    CookieUtils.saveToken(response);
    return;
  };

  public requestPasswordReset = async (email: string): Promise<void> => await this.post<void>(URLs.API.RESET_PASSWORD, {login: email});

  public resetPassword = async (token: string, password: string): Promise<void> => await this.patch<void>(`${URLs.API.RESET_PASSWORD}?token=${token}`, {
    newPassword: password,
  });

  public logout = async (): Promise<void> => {
    const response = await this.httpClient.post<void,
      SingleEntityResponse<void>>(URLs.API.LOGOUT);
    CookieUtils.clearToken();
    return response.data;
  };

  public isTokenValid(): boolean {
    return true;
  }
}