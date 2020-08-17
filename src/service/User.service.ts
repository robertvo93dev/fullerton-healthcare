import { AxiosError, AxiosResponse } from "axios";
import { Config } from "../configuration/config";
import { Credentials } from "../interface/Credentials";
import { commonAPI } from "./common-api.service";
import { User } from "../class/user";
import { JwtResponse } from "../class/common/response-data";

export class UserServiceApi {
    config: Config;
    constructor() {

        this.userLogin = this.userLogin.bind(this);
        this.userRegister = this.userRegister.bind(this);
        this.config = new Config();
    }

    /**
     * Handle login request
     * @param credentials user's infor
     */
    public userLogin(credentials: Credentials): Promise<JwtResponse> {
        return commonAPI.post<string, Credentials, AxiosResponse<JwtResponse>>(this.config.apiServiceURL.login, credentials)
            .then((res) => {
                return commonAPI.success(res);
            })
            .catch((error: AxiosError<Error>) => {
                throw error;
            });
    }

    /**
     * Handle logout request
     */
    public userLogout() {
        return commonAPI.post(this.config.apiServiceURL.logout)
            .then((res) => {
                return commonAPI.success(res);
            })
            .catch((error: AxiosError<Error>) => {
                throw error;
            });
    }

    /**
     * Handle register a new user
     * @param user user's object
     */
    public userRegister(user: User): Promise<JwtResponse> {
        return commonAPI.post<number, User, AxiosResponse<JwtResponse>>(this.config.apiServiceURL.register, user)
            .then((res) => {
                return commonAPI.success(res);
            })
            .catch((error: AxiosError<Error>) => {
                throw error;
            });
    }
}
