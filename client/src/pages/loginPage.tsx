import { AxiosError } from "axios";
import HttpStatusCodes from "http-status-codes";
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import userLoginValidator from "../common/validators/userLoginValidator";
import { APIContext } from "../providers/APIProvider";
import { NotificationContext } from "../providers/NotificationProvider";
import { StoreDispatch, StoreState } from '../store/store';

interface DispatchProps {
	userAuthenticated: (access_token: string) => void;
}

function LoginPageComponent(props: DispatchProps) {
	const history = useHistory();
	const notifier = React.useContext(NotificationContext);
	const api = React.useContext(APIContext);
	const [state, setState] = useState({
		username: "",
		password: "",
	});

	const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const property = ev.currentTarget.name;
		const value = ev.currentTarget.value;

		setState(state => {
			return {
				...state,
				[property]: value
			};
		})
	}

	const submitChange = async (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		try {
			const { error, value: validatedUser } = userLoginValidator.validate(state);
			if (error) return notifier.showNotification(error.message, "error");

			const { data: body } = await api.instance.post("/api/login", validatedUser);
			props.userAuthenticated(body.access_token);
			history.push("/");
			return notifier.showNotification("Login Successful!", "success");
		}
		catch (error) {
			if (error instanceof AxiosError) {
				const { status, data: body } = error.response!;
				if ([HttpStatusCodes.UNPROCESSABLE_ENTITY, HttpStatusCodes.NOT_FOUND, HttpStatusCodes.UNAUTHORIZED].includes(status))
					return notifier.showNotification(body.error.message, "error");
			}
		}
		return notifier.showNotification("An internal error occurred. Please contact system administrator.", "warning");
	}

	const getFormField = (display: string, property: string, value: string, type: string = "text") => {
		return (
			<div className="formGroup">
				<div className='label_holder'>
					<label htmlFor={ property }>{ display }</label>
				</div>
				<input type={ type } id={ property } name={ property } value={ value } onChange={ handleChange } />
			</div>
		);
	}

	return (
		<div className="center_form_container">
			<form onSubmit={ submitChange }>
				<h1 className="form_header">Log In</h1>
				{ getFormField("Username", "username", state.username) }
				{ getFormField("Password", "password", state.password, "password") }
				<button type='submit' className='btn btn-primary'>Submit</button>
			</form>
		</div>
	);
}

function mapStateToProps(state: StoreState, ownProps: any): RouteComponentProps {
	return {
		...ownProps,
	};
}

function mapDispatchToProps(dispatch: StoreDispatch): DispatchProps {
	return {
		userAuthenticated: (access_token: string) => dispatch({ type: "USER_AUTHENTICATED", access_token })
	}
}

const LoginPage = withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPageComponent));
export default LoginPage;