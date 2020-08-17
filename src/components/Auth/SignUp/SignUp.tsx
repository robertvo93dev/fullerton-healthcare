import React, { Component } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";

import { SignUpProp, SignUpState, initialSignUpState } from "./SignUpPropsStates";

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
const CustomTextBox: React.CSSProperties = {
    display: 'block',
    width: '100%',
    borderRadius: '.25rem',
    backgroundColor: '#f5f5f5',
    boxShadow: 'none',
    color: '#565656',
    lineHeight: 1.43,
    padding: '1.07em 0.5em',
    height: 'calc(2.25rem + 2px)',
    border: '1px solid #e8e8e8'
}
const Margin0: React.CSSProperties = {
    margin: 0
};
const TextCenter: React.CSSProperties = {
    textAlign: 'center'
};
const DangerText: React.CSSProperties = {
    color: 'red',
    fontStyle: 'italic'
};
const LinkA = styled.a`
    color: #149dcc !important;
    cursor: pointer;
`;
export default class SignUp extends Component<SignUpProp, SignUpState> {
    constructor(props: SignUpProp) {
        super(props);

        //initial variable
        this.state = initialSignUpState;

        //binding functions
        this.handleChange = this.handleChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.renderErrorMessage = this.renderErrorMessage.bind(this);
    }

    /**
     * handle change value of form
     * @param event Change event
     */
    handleChange(event: any) {
        const { name, value } = event.target;
        this.setState<never>({
            [name]: value
        }, () => {
            //validate form
            let { errors, valid } = this.validateForm();
            let disabled = !valid;
            this.setState({
                disableSubmitButton: disabled,
                errors
            });
        });
    }

    /**
     * Validate the sign up form
     */
    validateForm() {
        let valid = true;
        let errors: { [s: string]: string } = {};
        errors['firstName'] = this.state.firstName.length > 0 ? "" : "First Name is required";
        errors['lastName'] = this.state.lastName.length > 0 ? "" : "Last Name is required";
        errors['email'] = this.state.email.length > 0 ? "" : "Email is required";
        errors['password'] = this.state.password.length > 0 ? "" : "Password is required";
        errors['repassword'] = this.state.repassword.length > 0 ? "" : "Re-Password is required";
        if(this.state.repassword  !== "" && this.state.password !== this.state.repassword){
            errors.repassword = "Password and Re-Password are not match";
        }

        for (var key in errors) {
            if (errors[key].length > 0) {
                valid = false;
                break;
            }
        }
        return { errors, valid };
    }

    /**
     * Render error message base on question key
     * @param questionKey question key
     */
    renderErrorMessage(questionKey: string) {
        //get state.error message base on question key
        let errors = this.state.errors[questionKey];
        //if there is no error => return
        if (!errors || errors === "") return;
        //else display error message
        return (
            <div style={DangerText}>
                {
                    <div key={questionKey}>
                        <span>{errors}</span>
                    </div>
                }
            </div>
        );
    }

    /**
     * Handle redirect to login page
     */
    handleLogin() {
        this.setState({
            redirectLoginPage: true
        });
    }

    render() {
        if (this.state.redirectLoginPage) {
            return <Redirect push={true} to={this.props.LoginRedirectLink} />
        }
        return (
            <Container>
                <LoginDiv>
                    <form onSubmit={(e) => { e.preventDefault(); this.props.OnRegister(this.state) }}>
                        <h3 style={TextCenter}>Sign Up</h3>

                        <div className="form-group">
                            <label htmlFor="firstName">
                                <span style={DangerText}>* </span><span data-text="First name">First name</span>
                            </label>
                            <input name="firstName"
                                type="text"
                                onChange={this.handleChange}
                                style={CustomTextBox}
                                placeholder="First name" />
                            {this.renderErrorMessage('firstName')}
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">
                                <span style={DangerText}>* </span><span data-text="Last name">Last name</span>
                            </label>
                            <input name="lastName"
                                type="text"
                                onChange={this.handleChange}
                                style={CustomTextBox}
                                placeholder="Last name" />
                            {this.renderErrorMessage('lastName')}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                <span style={DangerText}>* </span><span data-text="Email address">Email address</span>
                            </label>
                            <input name="email"
                                type="email"
                                onChange={this.handleChange}
                                style={CustomTextBox}
                                placeholder="Enter email" />
                            {this.renderErrorMessage('email')}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <span style={DangerText}>* </span><span data-text="Password">Password</span>
                            </label>
                            <input name="password"
                                type="password"
                                onChange={this.handleChange}
                                style={CustomTextBox}
                                placeholder="Enter password" />
                            {this.renderErrorMessage('password')}
                        </div>

                        <div className="form-group">
                            <label htmlFor="repassword">
                                <span style={DangerText}>* </span><span data-text="Re-Password">Re-Password</span>
                            </label>
                            <input name="repassword"
                                type="password"
                                onChange={this.handleChange}
                                style={CustomTextBox}
                                placeholder="Re-Enter password" />
                            {this.renderErrorMessage('repassword')}
                        </div>

                        <button style={Margin0}
                            disabled={this.state.disableSubmitButton}
                            type="submit"
                            className="btn btn-primary btn-block">
                            Sign Up
                        </button>
                        <p className="forgot-password text-right">
                            Already registered <LinkA onClick={this.handleLogin}>Login?</LinkA>
                        </p>
                    </form>
                </LoginDiv>
            </Container>
        );
    }
}