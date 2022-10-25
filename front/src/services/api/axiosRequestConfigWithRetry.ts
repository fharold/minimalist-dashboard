import {AxiosRequestConfig} from "axios";

export interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  retry?: boolean;
}