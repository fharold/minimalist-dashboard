import {AxiosError, AxiosInstance} from "axios";
import {AccessTokenDTO} from "../../models/accessTokenDTO";
import {CookieUtils} from "../../utils/cookieUtils";
import {AxiosRequestConfigWithRetry} from "./axiosRequestConfigWithRetry";
import {SingleEntityResponse} from "../../models/api/singleEntityResponse";
import {HttpStatus} from "../../models/api/httpStatus";
import {HttpClient} from "./httpClient";
import {Navigation} from "../../utils/routes";
import {URLs} from "../../utils/urls";

export function addInterceptors(axios: AxiosInstance): void {
  // ADD AUTH TOKEN TO HEADERS
  axios.interceptors.request.use(
    (config) => {
      try {
        if (config.url && ![URLs.API.LOGIN, URLs.API.REFRESH, URLs.API.RESET_PASSWORD].includes(config.url)) {
          const token: AccessTokenDTO = CookieUtils.getToken();
          if (token.accessToken) {
            config.headers = {
              Authorization: `Bearer ${token.accessToken}`,
            };
          }
        } else if (config.url && config.url === URLs.API.REFRESH) {
          const token: AccessTokenDTO = CookieUtils.getToken();
          if (token.refreshToken) {
            config.headers = {
              Authorization: `Bearer ${token.refreshToken}`,
            };
          }
        }
      } catch (e) {

      }
      return config;
    },
    async (error) => Promise.reject(error)
  );

  // REFRESH TOKEN AND REDIRECT TO LOGIN IF FAIL
  axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config: AxiosRequestConfigWithRetry = error.config;
      //Login error will throw a 401, do not intercept that one
      if (
        error.config.url !== URLs.API.LOGIN &&
        error.config.url !== URLs.API.REFRESH &&
        error.response?.status === HttpStatus.UNAUTHORIZED
      ) {
        // TRY TO REFRESH THE ACCESS TOKEN
        if (!config.retry) {
          try {
            config.retry = true;
            const tokenObj: AccessTokenDTO = CookieUtils.getToken();
            if (tokenObj.refreshToken !== undefined) {
              const httpClient = HttpClient.getInstance();
              const data = await httpClient.post<AccessTokenDTO,
                SingleEntityResponse<AccessTokenDTO>>(URLs.API.REFRESH, {});
              CookieUtils.saveToken(data.data);
            } else {
              Navigation.redirectToLoginPage(Navigation.APP_ROUTES_QUERY_PARAM_ENUM.UNAUTHORIZED);
              return Promise.reject("No refresh token in the cookies.");
            }
          } catch (error) {
            console.error(error);
            return Promise.reject(
              "An error occurred while trying to refresh the access token."
            );
          }
          return axios(config);
        }
      }
      // ALREADY TRIED REFRESHING THE ACCESS TOKEN AND FAILED => REDIRECT TO LOGIN
      else if (config.url === URLs.API.REFRESH) {
        Navigation.redirectToLoginPage(Navigation.APP_ROUTES_QUERY_PARAM_ENUM.UNAUTHORIZED);
      }
      return Promise.reject(error);
    }
  );
}