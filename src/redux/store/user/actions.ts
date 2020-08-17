import { USER_LOGOUT, USER_LOGIN } from "./types";
import { User } from "../../../class/user";

export function loginUser(loginUser: User) {
  return {
    type: USER_LOGIN,
    payload: loginUser
  };
}

export function logoutUser() {
  return {
    type: USER_LOGOUT,
    meta: {}
  };
}
