import HttpStatusCodes from "http-status-codes";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { authenticationDetails, Fetch } from '../helpers/requestHelper';
import { StoreDispatch, StoreState } from '../store/store';

interface DispatchProps {
	userAuthenticated: (username: string, firstName: string, lastName: string, email: string, contactNumber: string) => void;
}

class LoginPageFields {
	username: string = "";
	password: string = "";
}

class LoginPageState {
	fields: LoginPageFields = new LoginPageFields();
	errors: LoginPageFields = new LoginPageFields();
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
		const property = ev.currentTarget.name;
		const value = ev.currentTarget.value;

		this.setState(state => {
			return {
				...state,
				fields: {
					...state.fields,
					[property]: value
				}
			};
		})
	}

	getFormField = (display: string, property: string, value: string, error: string, type: string = "text") => {
		return (
			<div className="formGroup">
				<div className='label_holder'>
					<label htmlFor={ property }>{ display }</label>
				</div>
				<input type={ type } id={ property } name={ property } value={ value } onChange={ this.handleChange } />
				{ error && <div className="form_error">{ error }</div> }
			</div>
		);
	}

	submitChange = (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		const fields = this.state.fields;
		let errors = new LoginPageFields();
		let hasErrors = false;

		let setError = (property: string, value: string) => {
			console.log(property, value);
			errors = {
				...errors,
				[property]: value
			};
			hasErrors = true;
		};

		if (!fields.username)
			setError("username", "Username is required!");

		if (!fields.password)
			setError("password", "Password is required!");

		if (hasErrors) {
			this.setState({ errors: errors });
		}
		else {
			this.setState({
				errors: new LoginPageFields(),
			}, () => {
				this.authenticateUser(this.state.fields);
			});
		}
	}

	authenticateUser = async (loginDetails: any) => {
		const response = await Fetch("/api/authenticate", {
			method: "POST",
			body: JSON.stringify(loginDetails)
		});
		switch (response.status) {
			case HttpStatusCodes.OK:
				this.setState({
					errorMessage: "",
					successMessage: "Login successfully. We will redirect you shortly."
				}, () => {
					setTimeout(async () => {
						const body = await response.json();
						authenticationDetails.authToken = body.authToken;
						const { firstName, lastName, email, contactNumber } = body;
						this.props.userAuthenticated(this.state.fields.username, firstName, lastName, email, contactNumber);
						this.props.history.push("/");
					}, 2000);
				});
				break;
			default:
				this.setState({
					errorMessage: "Invalid username or password"
				});
				break;
		}
	}

	render() {
		return (
			<div className="center_form_container">
				<form onSubmit={ this.submitChange }>
					<h1 className="form_header">Log In</h1>
					{ this.getFormField("Username", "username", this.state.fields.username, this.state.errors.username) }
					{ this.getFormField("Password", "password", this.state.fields.password, this.state.errors.password, "password") }
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
		userAuthenticated: (username: string, firstName: string, lastName: string, email: string, contactNumber: string) => dispatch({ type: "USER_AUTHENTICATED", username, firstName, lastName, email, contactNumber })
	}
}

const LoginPage = withRouter(connect(connectStateToProps, connectDispatchToProps)(LoginPageComponent));
export default LoginPage;