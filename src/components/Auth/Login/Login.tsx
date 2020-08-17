import React, { Component } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { LoginProps, LoginState, initialLoginState } from "./LoginPropsStates";
const Container = styled.div`
            padding-top: 30px;
            padding-bottom: 20px;
        `;
const LoginDiv = styled.div`
            width: 400px;
            margin: auto;
            background-color: #e9ecef;
            padding: 40px;
            border-radius: 15px;
        `;
const LinkDiv = styled.div`
            margin-top: 15px;
        `;
const LinkA = styled.a`
    color: #149dcc !important;
    cursor: pointer;
`;
export default class Login extends Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);

        this.state = initialLoginState;
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeByClick = this.handleChangeByClick.bind(this);
        this.handleRegisterPage = this.handleRegisterPage.bind(this);
    }

    /**
     * Handle change form's fields
     * @param event change event
     */
    handleChange(event: any) {
        this.setState<never>({
            [event.target.name]: event.target.value
        }, () => {
            let disabled = this.state.email !== '' && this.state.password !== '' ? false : true;
            this.setState({
                disableSubmitButton: disabled
            });
        });
    }

    /**
     * handle state change by click
     * @param event click event
     */
    handleChangeByClick(event: any) {
        this.setState<never>({
            [event.target.name]: event.target.checked
        });
    }

    /**
     * handle click register page
     */
    handleRegisterPage() {
        this.setState({
            redirectRegisterPage: true
        })
    }

    render() {
        //redirect to register page
        if (this.state.redirectRegisterPage) {
            return <Redirect push={true} to={this.props.RegisterPageRedirectLink} />
        }
        //load login form
        return (
            <Container>
                <LoginDiv>
                    <form onSubmit={(e) => { e.preventDefault(); this.props.OnLogin(this.state) }}>
                        <h3 style={{ textAlign: 'center' }}>Login</h3>

                        <div className="form-group">
                            <label><strong>Email address</strong></label>
                            <input name="email"
                                type="email"
                                onChange={this.handleChange}
                                className="form-control"
                                placeholder="Enter email" />
                        </div>

                        <div className="form-group">
                            <label><strong>Password</strong></label>
                            <input name="password"
                                type="password"
                                onChange={this.handleChange}
                                className="form-control"
                                placeholder="Enter password" />
                        </div>

                        <div className="form-group">
                            <div className="custom-control custom-checkbox">
                                <input name="rememberMe"
                                    type="checkbox"
                                    className="custom-control-input"
                                    onClick={this.handleChangeByClick}
                                    id="customCheck1" />
                                <label className="custom-control-label" htmlFor="customCheck1">
                                    <strong>Remember me</strong>
                                </label>
                            </div>
                        </div>

                        <input style={{ margin: 0 }}
                            type="submit"
                            value="Submit"
                            className="btn btn-primary btn-block"
                            disabled={this.state.disableSubmitButton}
                        />
                        <LinkDiv>
                            <p className="float-left">
                                <LinkA className="App-link" onClick={this.handleRegisterPage}>Sign Up</LinkA>
                            </p>
                        </LinkDiv>
                    </form>
                </LoginDiv>
            </Container>
        );
    }
}