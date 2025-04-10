import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { CONF_PAYXE_API_URL } from "../Boot/Config.js";

export default class Connection {
    private axiosInstance: AxiosInstance;

    constructor(baseURL = CONF_PAYXE_API_URL) {
        this.axiosInstance = axios.create({
            baseURL: baseURL,
        });
    }

    public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.axiosInstance.get<T>(url, config);
    }

    public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.axiosInstance.post<T>(url, data, config);
    }
}
