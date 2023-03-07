import axios, { AxiosError } from 'axios';
import HttpStatusCodes from "http-status-codes";
import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import userLoginValidator from '../common/validators/userLoginValidator';
import { DefaultProps } from '../models/defaultProps';
import { NotificationContext } from '../providers/notification';
import { authenticationStatusChanged } from "../redux/actions/authActions";
import { StoreDispatch, StoreState } from '../redux/store';

function mapState(state: StoreState, ownProps: DefaultProps) {
	return {
		...ownProps,
	};
}

function mapDispatch(dispatch: StoreDispatch) {
	return {
		authStatusChanged: (status: boolean) => dispatch(authenticationStatusChanged(status))
	}
}

function LoginPageComponent(props: ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>) {
	const history = useHistory();
	const notifier = useContext(NotificationContext);
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

			const { data: body } = await axios.post("/api/login", validatedUser);
			localStorage.setItem("accessToken", body.accessToken);
			history.push("/");
			props.authStatusChanged(true);
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
		<>
			<Helmet>
				<title>Login | Mern Stack BoilerPlate</title>
			</Helmet>
			<div className="fullSizeCenterContainer">
				<form onSubmit={ submitChange }>
					<h1 className="form_header">Log In</h1>
					{ getFormField("Username", "username", state.username) }
					{ getFormField("Password", "password", state.password, "password") }
					<button type='submit' className='btn btn-primary'>Submit</button>
				</form>
			</div>
		</>
	);
}

const LoginPage = connect(mapState, mapDispatch)(LoginPageComponent);
export default LoginPage;