import HttpStatusCodes from "http-status-codes";
import { Component } from 'react';
import { RouteComponentProps, withRouter } from "react-router-dom";
import userRegistrationValidator from "../common/validators/userRegistrationValidator";
import { POST } from '../helpers/requestHelper';

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
	successMessage: string = "";
	errorMessage: string = "";
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
				fields: {
					...state.fields,
					[property]: value
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

		const { error, value: validatedUser } = userRegistrationValidator.validate(this.state.fields);
		if (error) return this.setState({ errorMessage: error.message });

		this.setState({ errorMessage: "" }, async () => {
			await this.createUser(validatedUser);
		});
	}

	createUser = async (user: any) => {
		const response = await POST("/api/register", user);
		const body = await response.json();

		switch (response.status) {
			case HttpStatusCodes.OK:
				return this.setState({ errorMessage: "", successMessage: "Account created successfully. We will redirect you shortly." },
					() => setTimeout(() => {
						this.props.history.push("/login");
					}, 2000)
				);
			case HttpStatusCodes.UNPROCESSABLE_ENTITY:
			case HttpStatusCodes.CONFLICT:
				return this.setState({
					errorMessage: body.error.message
				});
			default:
				return this.setState({
					errorMessage: "An internal error occurred. Please contact system administrator."
				});
		}
	}

	render() {
		return (
			<div className="center_form_container">
				<form onSubmit={ this.submitChange }>
					<h1 className="form_header">Sign Up</h1>
					{ this.getFormField("Username", "username", this.state.fields.username) }
					{ this.getFormField("Password", "password", this.state.fields.password, "password") }
					{ this.getFormField("Confirm Password", "confirmPassword", this.state.fields.confirmPassword, "password") }
					{ this.getFormField("First Name", "firstName", this.state.fields.firstName) }
					{ this.getFormField("Last Name", "lastName", this.state.fields.lastName) }
					{ this.getFormField("Email", "email", this.state.fields.email, "email") }
					{ this.getFormField("Contact Number", "contactNumber", this.state.fields.contactNumber, "tel") }
					<button type='submit' className='btn btn-primary'>Submit</button>
					{ this.state.errorMessage && <div className="error_message">{ this.state.errorMessage }</div> }
					{ this.state.successMessage && <div className="success_message">{ this.state.successMessage }</div> }
				</form>
			</div>
		);
	}
}

const SignUpPage = withRouter(SignUpPageComponent);
export default SignUpPage;