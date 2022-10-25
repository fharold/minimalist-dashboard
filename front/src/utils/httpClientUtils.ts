import Axios, {AxiosResponse} from "axios";
import {HttpStatus} from "../models/api/httpStatus";

export class HttpClientUtils {
  public static handleAxiosException(error: unknown): void {
    if (Axios.isAxiosError(error)) {
      throw new Error(`AxiosError: ${error.message}`);
    } else if (typeof error === "string") {
      throw new Error(error);
    } else {
      throw new Error("unknown AxiosError");
    }
  }

  public static handleAPIErrorIfNecessary<T>(response: AxiosResponse<T>): void {
    if (response.status >= 400) {
      switch (response.status) {
        case HttpStatus.BAD_REQUEST:
          throw new Error("400: Bad request");
        case HttpStatus.UNAUTHORIZED:
          throw new Error("401: Unauthorized");
        case HttpStatus.FORBIDDEN:
          throw new Error("403: Forbidden");
        case HttpStatus.NOT_FOUND:
          throw new Error("404: Not Found");
        case HttpStatus.NOT_ALLOWED:
          throw new Error("405: Not Allowed");
        case HttpStatus.TIMEOUT:
          throw new Error("408: Timeout");
        case HttpStatus.CONFLICT:
          throw new Error("409: Duplicate");
        case HttpStatus.UNPROCESSABLE_ENTITY:
          throw new Error("422: Unprocessable Entity");
        case HttpStatus.INTERNAL_SERVER_ERRROR:
          throw new Error("500: Internal Server Error");
        default:
          throw new Error("Unknown server error");
      }
    }
  }
  //
  // public static generateUrl: <S extends string>(
  //   path: S,
  //   params?: ExtractRouteParams<S>
  // ) => string = generatePath;
}
