export interface LoginProps {
	OnLogin: (form:LoginState) => void,
	RegisterPageRedirectLink: string
}

export type LoginState = {
	email: string,
	password: string,
	rememberMe: boolean,
	disableSubmitButton: boolean,
	redirectRegisterPage: boolean
}

export const initialLoginState: LoginState = {
	email: '',
	password: '',
	rememberMe: false,
	disableSubmitButton: true,
	redirectRegisterPage: false
}