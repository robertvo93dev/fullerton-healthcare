import { AxiosRequestConfig } from "axios";
const qs = require("qs");
export const API_TIMEOUT = Number(process.env.REACT_APP_API_TIMEOUT) || 10000;
export const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL || "";

export const apiConfig: AxiosRequestConfig = {
    timeout: API_TIMEOUT,
    baseURL: REACT_APP_SERVER_URL,
    headers: {
        common: {
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    },
    paramsSerializer: (params: string) => qs.stringify(params, { indices: false })
};
