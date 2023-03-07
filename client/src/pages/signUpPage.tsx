import axios, { AxiosError } from "axios";
import HttpStatusCodes from "http-status-codes";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router-dom";
import userRegistrationValidator from "../common/validators/userRegistrationValidator";
import { NotificationContext } from "../providers/notification";

export default function SignUpPage() {
	const history = useHistory();
	const notifier = React.useContext(NotificationContext);
	const [state, setState] = useState({
		username: "",
		password: "",
		confirmPassword: "",
		firstName: "",
		lastName: "",
		email: "",
		contactNumber: "",
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
			const { error, value: validatedUser } = userRegistrationValidator.validate(state);
			if (error) return notifier.showNotification(error.message, "error");
			await axios.post("/api/register", validatedUser);
			history.push("/login");
			return notifier.showNotification("Account created successfully!", "success");
		}
		catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response!;
				if ([HttpStatusCodes.UNPROCESSABLE_ENTITY, HttpStatusCodes.CONFLICT].includes(response.status))
					return notifier.showNotification(response.data.message, "error");
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
				<title>Signup | Mern Stack BoilerPlate</title>
			</Helmet>
			<div className="fullSizeCenterContainer">
				<form onSubmit={ submitChange }>
					<h1 className="form_header">Sign Up</h1>
					{ getFormField("Username", "username", state.username) }
					{ getFormField("Password", "password", state.password, "password") }
					{ getFormField("Confirm Password", "confirmPassword", state.confirmPassword, "password") }
					{ getFormField("First Name", "firstName", state.firstName) }
					{ getFormField("Last Name", "lastName", state.lastName) }
					{ getFormField("Email", "email", state.email, "email") }
					{ getFormField("Contact Number", "contactNumber", state.contactNumber, "tel") }
					<button type='submit' className='btn btn-primary'>Submit</button>
				</form>
			</div>
		</>
	);
}