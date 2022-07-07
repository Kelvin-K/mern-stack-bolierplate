import HttpStatusCodes from 'http-status-codes';
import { Component } from 'react';
import { connect } from 'react-redux';
import { authenticationDetails, GET, POST } from '../helpers/requestHelper';
import { StoreDispatch, StoreState } from '../store/store';

interface StateProps {
	isAuthenticated: boolean;
	userDetailsAvailable: boolean;
	children: any;
}

interface DispatchProps {
	userAuthenticated: () => void;
	userDetailsReceived: (username: string, firstName: string, lastName: string, email: string, contactNumber: string) => void;
}

export class ServerHelperComponent extends Component<StateProps & DispatchProps, any>
{
	async componentDidMount() {
		if (!this.props.isAuthenticated) {
			const response = await POST("/api/refresh-token", {});
			if (response.status === HttpStatusCodes.OK) {
				const { accessToken } = await response.json();
				authenticationDetails.accessToken = accessToken;
				this.props.userAuthenticated();
			}
		}
	}

	async componentDidUpdate() {
		if (this.props.isAuthenticated && !this.props.userDetailsAvailable) {
			const response = await GET("/api/users");
			if (response.status === HttpStatusCodes.OK) {
				const { username, firstName, lastName, email, contactNumber } = await response.json();
				this.props.userDetailsReceived(username, firstName, lastName, email, contactNumber);
			}
		}
	}

	render() {
		return this.props.children;
	}
}

function connectStateToProps(state: StoreState, ownProps: any): StateProps {
	return {
		...ownProps,
		isAuthenticated: state.user.isAuthenticated,
		userDetailsAvailable: state.user.userDetailsAvailable,
	};
}

function connectDispatchToProps(dispatch: StoreDispatch): DispatchProps {
	return {
		userAuthenticated: () => dispatch({ type: "USER_AUTHENTICATED" }),
		userDetailsReceived: (username: string, firstName: string, lastName: string, email: string, contactNumber: string) => dispatch({ type: "USER_DETAILS_RECEIVED", username, firstName, lastName, email, contactNumber }),
	}
}

let ServerHelper = connect(connectStateToProps, connectDispatchToProps)(ServerHelperComponent);
export default ServerHelper;