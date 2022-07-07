import HttpStatusCodes from "http-status-codes";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import userLoginSchema from "../common/validators/userLoginValidator";
import { authenticationDetails, POST } from '../helpers/requestHelper';
import { StoreDispatch, StoreState } from '../store/store';

interface DispatchProps {
	userAuthenticated: () => void;
}

class LoginPageFields {
	username: string = "";
	password: string = "";
}

class LoginPageState {
	fields: LoginPageFields = new LoginPageFields();
	successMessage: string = "";
	errorMessage: string = "";
}


class LoginPageComponent extends Component<RouteComponentProps & DispatchProps, LoginPageState>
{
	constructor(props: any) {
		super(props);
		this.state = new LoginPageState();
	}

	handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		this.setState(state => {
			return {
				...state,
				fields: {
					...state.fields,
					[ev.currentTarget.name]: ev.currentTarget.value
				}
			};
		})
	}

	getFormField = (display: string, property: string, value: string, type: string = "text") => {
		return (
			<div className="formGroup">
				<div className='label_holder'>
					<label htmlFor={ property }>{ display }</label>
				</div>
				<input type={ type } id={ property } name={ property } value={ value } onChange={ this.handleChange } />
			</div>
		);
	}

	submitChange = (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		const { error, value: validatedUser } = userLoginSchema.validate(this.state.fields);
		if (error) return this.setState({ errorMessage: error.message });

		this.setState({ errorMessage: "", }, async () => {
			await this.login(validatedUser);
		});
	}

	login = async (loginDetails: any) => {
		const response = await POST("/api/login", loginDetails);
		const body = await response.json();

		switch (response.status) {
			case HttpStatusCodes.OK:
				return this.setState({ errorMessage: "", successMessage: "Login successfully. We will redirect you shortly." },
					() => setTimeout(() => {
						authenticationDetails.accessToken = body.accessToken;
						this.props.userAuthenticated();
						this.props.history.push("/");
					}, 2000)
				);
			case HttpStatusCodes.NOT_FOUND:
			case HttpStatusCodes.UNAUTHORIZED:
				return this.setState({
					errorMessage: body.error.message
				});
			default:
				return this.setState(({
					errorMessage: "An internal error occurred. Please contact system administrator."
				}));
		}
	}

	render() {
		return (
			<div className="center_form_container">
				<form onSubmit={ this.submitChange }>
					<h1 className="form_header">Log In</h1>
					{ this.getFormField("Username", "username", this.state.fields.username) }
					{ this.getFormField("Password", "password", this.state.fields.password, "password") }
					<button type='submit' className='btn btn-primary'>Submit</button>
					{ this.state.errorMessage && <div className="error_message">{ this.state.errorMessage }</div> }
					{ this.state.successMessage && <div className="success_message">{ this.state.successMessage }</div> }
				</form>
			</div>
		);
	}
}

function connectStateToProps(state: StoreState, ownProps: any): RouteComponentProps {
	return {
		...ownProps,
	};
}

function connectDispatchToProps(dispatch: StoreDispatch): DispatchProps {
	return {
		userAuthenticated: () => dispatch({ type: "USER_AUTHENTICATED" })
	}
}

const LoginPage = withRouter(connect(connectStateToProps, connectDispatchToProps)(LoginPageComponent));
export default LoginPage;