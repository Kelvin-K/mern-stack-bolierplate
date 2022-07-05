import HttpStatusCodes from "http-status-codes";
import { Component } from 'react';
import { validateContactNumber, validateEmail, validateFirstOrLastName, validatePassword, validateUsername } from "../common/validators";
import { Fetch } from '../helpers/requestHelper';

class SignUpPageFields {
	username: string = "";
	password: string = "";
	confirmPassword = "";
	firstName: string = "";
	lastName: string = "";
	email: string = "";
	contactNumber: string = "";
}

class SignUpPageState {
	fields: SignUpPageFields = new SignUpPageFields();
	errors: SignUpPageFields = new SignUpPageFields();
	errorMessage: string = "";
	successMessage: string = "";
}

export default class SignUpPage extends Component<{}, SignUpPageState> {

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
				<input type={ type } id={ property } name={ property } value={ value } onChange={ this.handleChange } placeholder={ "Enter your " + display + " here" } />
				{
					error &&
					<div className="error-msg">{ error }</div>
				}
			</div>
		);
	}

	submitChange = (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		const fields = this.state.fields;
		let errors = new SignUpPageFields();
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
		else if (!validateUsername(fields.username))
			setError("username", "Username is invalid!");

		if (!fields.password)
			setError("password", "Password is required!");
		else if (!validatePassword(fields.password))
			setError("password", "Password is invalid!");

		if (!fields.confirmPassword)
			setError("confirmPassword", "Confirm password is required!");
		else if (fields.password !== fields.confirmPassword)
			setError("confirmPassword", "Confirm password does not match!");

		if (!fields.firstName)
			setError("firstName", "First Name is required!");
		else if (!validateFirstOrLastName(fields.firstName))
			setError("firstName", "First Name is invalid!");

		if (!fields.lastName)
			setError("lastName", "Last Name is required!");
		else if (!validateFirstOrLastName(fields.lastName))
			setError("lastName", "Last Name is invalid!");

		if (!fields.email)
			setError("email", "Email is required!");
		else if (!validateEmail(fields.email))
			setError("email", "Email is invalid!");

		if (!fields.contactNumber)
			setError("contactNumber", "Contact Number is required!");
		else if (!validateContactNumber(fields.contactNumber))
			setError("contactNumber", "Contact Number is invalid!");

		if (hasErrors) {
			this.setState({ errors: errors });
		}
		else {
			const { confirmPassword, ...user } = fields;
			this.createUser(user);
		}
	}

	createUser = (user: any) => {
		this.setState({
			errors: new SignUpPageFields(),
		}, async () => {
			const response = await Fetch("/api/users", {
				method: "POST",
				body: JSON.stringify(user)
			});
			switch (response.status) {
				case HttpStatusCodes.OK:
					this.setState({
						successMessage: "Account created successfully."
					});
					break;
				case HttpStatusCodes.CONFLICT:
					this.setState({
						errorMessage: "User with this username or email already exist."
					});
					break;
				default:
					this.setState({
						errorMessage: "An internal error occurred. Please contact administrator."
					});
					break;
			}
		})
	}

	render() {
		return (
			<div className="center_form_container">
				<form onSubmit={ this.submitChange }>
					<h1 className="form_header">Sign Up</h1>
					{ this.getFormField("Username", "username", this.state.fields.username, this.state.errors.username) }
					{ this.getFormField("Password", "password", this.state.fields.password, this.state.errors.password, "password") }
					{ this.getFormField("Confirm Password", "confirmPassword", this.state.fields.confirmPassword, this.state.errors.confirmPassword, "password") }
					{ this.getFormField("First Name", "firstName", this.state.fields.firstName, this.state.errors.firstName) }
					{ this.getFormField("Last Name", "lastName", this.state.fields.lastName, this.state.errors.lastName) }
					{ this.getFormField("Email", "email", this.state.fields.email, this.state.errors.email, "email") }
					{ this.getFormField("Contact Number", "contactNumber", this.state.fields.contactNumber, this.state.errors.contactNumber, "tel") }
					<button type='submit' className='btn btn-primary'>Submit</button>
					{
						this.state.errorMessage &&
						<div className="error_message">{ this.state.errorMessage }</div>
					}
					{
						this.state.successMessage &&
						<div className="success_message">{ this.state.successMessage }</div>
					}
				</form>
			</div>
		);
	}
}