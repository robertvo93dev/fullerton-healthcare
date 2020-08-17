import React from 'react';
import {
	HashRouter as Router,
	Switch,
	Route,
	Redirect
} from "react-router-dom";
import { connect } from 'react-redux';

import './App.css';
import SignUp from './components/Auth/SignUp/SignUp';
import { SignUpState } from './components/Auth/SignUp/SignUpPropsStates';
import Login from './components/Auth/Login/Login';
import { LoginState } from './components/Auth/Login/LoginPropsStates';
import Toolbar from './components/Toolbar/Toolbar';
import { Config } from './configuration/config';
import { User } from './class/user';
import { Credentials } from './interface/Credentials';
import { UserServiceApi } from './service/User.service';
import { AppState } from './redux/store';
import { loginUser } from './redux/store/user/actions'
import BookingContainer from './redux/containers/Bookings/BookingContainer';
import { updateAlert } from './redux/store/request/actions';
import SecureRoute from './components/SecureRoute/SecureRoute';
import EventTypeContainer from './redux/containers/EventTypes/EventTypeContainer';
import { Page401 } from './components/Page401/Page401';

interface AppStates {
	redirectLogin: boolean,
	redirectHome: boolean
}

interface AppProps {
	user: any,
	loginUser: typeof loginUser;
	updateAlert: typeof updateAlert
}

class App extends React.Component<AppProps, AppStates> {
	userService: UserServiceApi;	//user service
	config: Config;
	constructor(props: AppProps) {
		super(props);
		//initial variables
		this.state = {
			redirectLogin: false,
			redirectHome: false
		}
		this.userService = new UserServiceApi();
		this.config = new Config();

		this.handleOnSubmitLoginForm = this.handleOnSubmitLoginForm.bind(this);
		this.handleOnSubmitRegisterForm = this.handleOnSubmitRegisterForm.bind(this);
		this.handleRenderRedirectRouter = this.handleRenderRedirectRouter.bind(this);
	}

	componentDidUpdate() {
		//reset state to false to help the next time the redirect function effect to app
		if (this.state.redirectHome) {
			this.setState({
				redirectHome: false
			});
		}
		else if (this.state.redirectLogin) {
			this.setState({
				redirectLogin: false
			});
		}
	}

	//------------------------------------------LOG IN COMPONENT-----------------------------
	/**
	 * handle login form submit
	 * @param form login state
	 */
	async handleOnSubmitLoginForm(form: LoginState) {
		//create login's info send to server
		let credentials: Credentials = {
			username: form.email,
			password: form.password,
			rememberMe: form.rememberMe
		}
		this.userService.userLogin(credentials)
			.then((result) => {
				//login success
				if (result && result.email === form.email) {
					let user = new User(result);
					user.isAdmin = user.role === this.config.roleDefinition.fullertonAdmin;
					user.isHr = user.role === this.config.roleDefinition.companyHR;
					//store login user to redux
					this.props.loginUser(user);
					//redirect to dashboard(homepage)
					this.setState({
						redirectHome: true
					});
				}
				else {
					//show alert message could not find user
					this.props.updateAlert({
						show: true,
						value: this.config.commonMessage.userNotFound,
						variant: this.config.alertVariants.danger
					});
				}
			}).catch((err) => {
				//show alert message login fail
				this.props.updateAlert({
					show: true,
					value: this.config.commonMessage.loginError,
					variant: this.config.alertVariants.danger
				});
			});
	}

	//------------------------------------------SIGN UP COMPONENT----------------------------
	/**
	 * handle sign up form submit
	 * @param form sign up state
	 */
	handleOnSubmitRegisterForm(form: SignUpState) {
		//convert user's input to user's object
		let newUser = new User({
			firstName: form.firstName,
			lastName: form.lastName,
			email: form.email,
			password: form.password,
			role: this.config.roleDefinition.companyHR	//Company HR (User): default
		});
		this.userService.userRegister(newUser)
			.then((result) => {
				//redirect to login page when register successful
				this.props.updateAlert({
					show: true,
					value: this.config.commonMessage.signUpSuccess,
					variant: this.config.alertVariants.success
				});
				this.setState({
					redirectLogin: true
				});
			})
			.catch((err) => {
				let message = (err.response && err.response.data) ? err.response.data : this.config.commonMessage.signUpError;
				//show error message
				this.props.updateAlert({
					show: true,
					value: message,
					variant: this.config.alertVariants.danger
				});
			});
	}

	/**
	 * Handle the case system want to redirect new page
	 */
	handleRenderRedirectRouter() {
		if (this.state.redirectLogin) {
			return (
				<Redirect push={true} to="/login"></Redirect>
			)
		}
		else if (this.state.redirectHome) {
			return (
				<Redirect push={true} to="/bookings"></Redirect>
			)
		}
	}

	render() {
		return (
			<Router>
				<Toolbar />
				{
					this.handleRenderRedirectRouter()
				}
				<div className="container">
					<Switch>
						<Route exact path="/login">
							<Login OnLogin={this.handleOnSubmitLoginForm}
								RegisterPageRedirectLink="/signup"
							/>
						</Route>

						<SecureRoute path="/bookings"
							component={BookingContainer} />

						<SecureRoute path="/eventtypes"
							adminOnly={true}
							component={EventTypeContainer} />

						<Route exact path="/page401">
							<Page401/>
						</Route>

						<Route exact path="/signup">
							<SignUp OnRegister={this.handleOnSubmitRegisterForm}
								LoginRedirectLink="/login" />
						</Route>
					</Switch>
				</div>
			</Router>
		);
	}
}

const mapStateToProps = (state: AppState) => ({
	user: state.user
});

const MapDispatchToProps = {
	updateAlert,
	loginUser
};

export default connect(
	mapStateToProps,
	MapDispatchToProps
)(App);