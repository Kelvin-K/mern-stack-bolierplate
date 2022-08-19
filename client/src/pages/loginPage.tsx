import { AxiosError } from "axios";
import HttpStatusCodes from "http-status-codes";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import userLoginValidator from "../common/validators/userLoginValidator";
import AxiosAPI from "../helpers/axiosAPI";
import InstanceHelper from "../helpers/instanceHelper";
import { StoreDispatch, StoreState } from '../store/store';

interface DispatchProps {
	userAuthenticated: (access_token: string) => void;
}

class LoginPageState {
	username: string = "";
	password: string = "";
}

class LoginPageComponent extends Component<RouteComponentProps & DispatchProps, LoginPageState>
{
	constructor(props: any) {
		super(props);
		this.state = new LoginPageState();
	}

	handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const property = ev.currentTarget.name;
		const value = ev.currentTarget.value;

		this.setState(state => {
			return {
				...state,
				[property]: value
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

	submitChange = async (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		try {
			const { error, value: validatedUser } = userLoginValidator.validate(this.state);
			if (error) return InstanceHelper.notifier.showNotification(error.message, "error");

			const { data: body } = await AxiosAPI.instance.post("/api/login", validatedUser);
			this.props.userAuthenticated(body.access_token);
			this.props.history.push("/");
			return InstanceHelper.notifier.showNotification("Login Successful!", "success");
		}
		catch (error) {
			if (error instanceof AxiosError) {
				const { status, data: body } = error.response!;
				if ([HttpStatusCodes.UNPROCESSABLE_ENTITY, HttpStatusCodes.NOT_FOUND, HttpStatusCodes.UNAUTHORIZED].includes(status))
					return InstanceHelper.notifier.showNotification(body.error.message, "error");
			}
		}
		return InstanceHelper.notifier.showNotification("An internal error occurred. Please contact system administrator.", "warning");
	}

	render() {
		return (
			<div className="center_form_container">
				<form onSubmit={ this.submitChange }>
					<h1 className="form_header">Log In</h1>
					{ this.getFormField("Username", "username", this.state.username) }
					{ this.getFormField("Password", "password", this.state.password, "password") }
					<button type='submit' className='btn btn-primary'>Submit</button>
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
		userAuthenticated: (access_token: string) => dispatch({ type: "USER_AUTHENTICATED", access_token })
	}
}

const LoginPage = withRouter(connect(connectStateToProps, connectDispatchToProps)(LoginPageComponent));
export default LoginPage;