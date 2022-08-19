import { AxiosError } from "axios";
import HttpStatusCodes from "http-status-codes";
import { Component } from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import userRegistrationValidator from "../common/validators/userRegistrationValidator";
import AxiosAPI from "../helpers/axiosAPI";
import InstanceHelper from "../helpers/instanceHelper";

class SignUpPageState {
	username: string = "";
	password: string = "";
	confirmPassword = "";
	firstName: string = "";
	lastName: string = "";
	email: string = "";
	contactNumber: string = "";
}

class SignUpPageComponent extends Component<RouteComponentProps, SignUpPageState> {

	constructor(props: any) {
		super(props);
		this.state = new SignUpPageState();
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
			const { error, value: validatedUser } = userRegistrationValidator.validate(this.state);
			if (error) return InstanceHelper.notifier.showNotification(error.message, "error");

			const response = await AxiosAPI.instance.post("/api/register", validatedUser);
			this.props.history.push("/login");
			return InstanceHelper.notifier.showNotification("Account created successfully!", "success");
		}
		catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response!;
				if ([HttpStatusCodes.UNPROCESSABLE_ENTITY, HttpStatusCodes.CONFLICT].includes(response.status))
					return InstanceHelper.notifier.showNotification(response.data.message, "error");
			}
		}
		return InstanceHelper.notifier.showNotification("An internal error occurred. Please contact system administrator.", "warning");
	}

	render() {
		return (
			<div className="center_form_container">
				<form onSubmit={ this.submitChange }>
					<h1 className="form_header">Sign Up</h1>
					{ this.getFormField("Username", "username", this.state.username) }
					{ this.getFormField("Password", "password", this.state.password, "password") }
					{ this.getFormField("Confirm Password", "confirmPassword", this.state.confirmPassword, "password") }
					{ this.getFormField("First Name", "firstName", this.state.firstName) }
					{ this.getFormField("Last Name", "lastName", this.state.lastName) }
					{ this.getFormField("Email", "email", this.state.email, "email") }
					{ this.getFormField("Contact Number", "contactNumber", this.state.contactNumber, "tel") }
					<button type='submit' className='btn btn-primary'>Submit</button>
				</form>
			</div>
		);
	}
}

const SignUpPage = withRouter(SignUpPageComponent);
export default SignUpPage;