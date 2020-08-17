
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { commonAPI } from "../../../service/common-api.service";

export class ReferenceService {
    constructor(config: AxiosRequestConfig) {
        this.getByUrl = this.getByUrl.bind(this);
    }

    /**
     * Get data by url
     */
    public async getByUrl(url: string): Promise<any[]>{
        try {
            const res: AxiosResponse<any[]> = await commonAPI.get<any, AxiosResponse<any[]>>(url);
            return commonAPI.success(res);
        } catch (error) {
            throw error;
        }
    }
}