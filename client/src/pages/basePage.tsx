import HttpStatusCodes from "http-status-codes";
import { Component } from 'react';
import { connect } from 'react-redux';
import Footer from '../components/footer';
import Header from '../components/header';
import { authenticationDetails, Fetch } from '../helpers/requestHelper';
import { StoreDispatch, StoreState } from '../store/store';

interface StateProps {
	children: any;
}

interface DispatchProps {
	userAuthenticated: (username: string, firstName: string, lastName: string, email: string, contactNumber: string) => void;
}

export class BasePageComponent extends Component<StateProps & DispatchProps, any>
{
	async componentDidMount() {
		const response = await Fetch("/api/authenticate/status", {
			method: "POST"
		});
		switch (response.status) {
			case HttpStatusCodes.OK:
				const body = await response.json();
				authenticationDetails.authToken = body.authToken;
				const { username, firstName, lastName, email, contactNumber } = body;
				this.props.userAuthenticated(username, firstName, lastName, email, contactNumber);
				break;
		}
	}

	render() {
		return (
			<>
				<Header />
				{ this.props.children }
				<Footer />
			</>
		);
	}
}

function connectStateToProps(state: StoreState, ownProps: any): StateProps {
	return {
		...ownProps,
	};
}

function connectDispatchToProps(dispatch: StoreDispatch): DispatchProps {
	return {
		userAuthenticated: (username: string, firstName: string, lastName: string, email: string, contactNumber: string) => dispatch({ type: "USER_AUTHENTICATED", username, firstName, lastName, email, contactNumber })
	}
}

let BasePage = connect(connectStateToProps, connectDispatchToProps)(BasePageComponent);
export default BasePage;