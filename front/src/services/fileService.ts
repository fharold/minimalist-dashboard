import {AuthService} from "./authService";

export class FileService {
  static getFileURL(key: string, authSvc: AuthService): string {
    return `${process.env.REACT_APP_API_BASE_URL}/files/${key}?accessToken=${authSvc.accessToken}`;
  }

  static getConfigurationDatasheetURL(cfgId: string, authSvc: AuthService): string {
    return `${process.env.REACT_APP_API_BASE_URL}/configurations/${cfgId}/datasheet?accessToken=${authSvc.accessToken}`;
  }
}