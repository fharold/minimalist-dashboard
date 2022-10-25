import {CookieUtils} from "./cookieUtils";
import {URLs} from "./urls";
import {ServiceRepository} from "../services/serviceRepository";
import {customHistory} from "../index";

export namespace Navigation {
  export enum APP_ROUTES_QUERY_PARAM_ENUM {
    UNAUTHORIZED = "?unauthorized",
    PASSWORD_INIT = "?password_init",
    PASSWORD_RESET = "?password_reset",
    SIGN_OUT = "?signOut",
  }

  export function goBack() {
    customHistory.back();
  }

  export function redirectToLoginPage(param: APP_ROUTES_QUERY_PARAM_ENUM): void {
    if (window.location.pathname === URLs.Front.LOGIN) return;

    CookieUtils.clearToken();
    navigate(`${URLs.Front.LOGIN}${param}`, false);
  }

  export function redirectToRoot(): void {
    const policySvc = ServiceRepository.getInstance().policySvc;
    if (["", "/", policySvc.policy.getLandingURL()].includes(window.location.pathname)) return;

    navigate(policySvc.policy.getLandingURL(), false);
  }

  export function navigate(location: string, trackHistory: boolean) {
    if (window.location.pathname === location) {
      return;
    }

    if (trackHistory) {
      customHistory.push(location);
    } else {
      customHistory.replace(location);
    }
  }
}