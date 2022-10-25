import Cookies from "js-cookie";
import {AccessTokenDTO} from "../models/accessTokenDTO";
import {Navigation} from "./routes";

const KEY_COOKIE_TOKEN_ACCESS_TOKEN = "KEY_COOKIE_TOKEN_ACCESS_TOKEN";
const KEY_COOKIE_TOKEN_REFRESH_TOKEN = "KEY_COOKIE_TOKEN_REFRESH_TOKEN";

export class CookieUtils {
  public static getToken(): AccessTokenDTO {
    let accessToken = Cookies.get(KEY_COOKIE_TOKEN_ACCESS_TOKEN);
    let refreshToken = Cookies.get(KEY_COOKIE_TOKEN_REFRESH_TOKEN);

    if (!accessToken || !refreshToken) {
      console.info("Token not found in cookies.");
      Navigation.redirectToLoginPage(Navigation.APP_ROUTES_QUERY_PARAM_ENUM.UNAUTHORIZED);
      throw new Error("Token not found in cookies.")
    }

    return {
      accessToken: accessToken,
      refreshToken: refreshToken
    };
  }

  public static saveToken(fullAccessToken: AccessTokenDTO): void {
    fullAccessToken.accessToken
      ? Cookies.set(KEY_COOKIE_TOKEN_ACCESS_TOKEN, fullAccessToken.accessToken)
      : Cookies.remove(KEY_COOKIE_TOKEN_ACCESS_TOKEN);
    fullAccessToken.refreshToken
      ? Cookies.set(
        KEY_COOKIE_TOKEN_REFRESH_TOKEN,
        fullAccessToken.refreshToken
      )
      : Cookies.remove(KEY_COOKIE_TOKEN_REFRESH_TOKEN);
  }

  public static clearToken(): void {
    Cookies.remove(KEY_COOKIE_TOKEN_ACCESS_TOKEN);
    Cookies.remove(KEY_COOKIE_TOKEN_REFRESH_TOKEN);
  }
}