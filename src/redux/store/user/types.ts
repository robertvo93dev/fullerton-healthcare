import { User } from "../../../class/user";

// Describing the different ACTION NAMES available
export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";

interface UserLoginAction {
  type: typeof USER_LOGIN;
  payload: User;
}

interface UserLogoutAction {
  type: typeof USER_LOGOUT;
  meta: {
    timestamp: number;
  };
}

export type UserActionTypes = UserLoginAction | UserLogoutAction;
