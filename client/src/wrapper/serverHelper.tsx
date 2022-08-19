import { Component } from 'react';
import { connect } from 'react-redux';
import Loading from '../components/loading';
import AxiosAPI from '../helpers/axiosAPI';
import { StoreDispatch, StoreState } from '../store/store';

interface StateProps {
	isAuthenticated: boolean;
	userDetailsAvailable: boolean;
	authenticationStatusChecked: boolean;
	children: any;
}

interface DispatchProps {
	userAuthenticationStatusChecked: (isAuthenticated: boolean) => void;
	userDetailsReceived: (username: string, firstName: string, lastName: string, email: string, contactNumber: string) => void;
}

export class ServerHelperComponent extends Component<StateProps & DispatchProps, any>
{
	async componentDidMount() {
		if (!this.props.authenticationStatusChecked) {
			try {
				let refreshToken = await AxiosAPI.refreshAccessToken();
				this.props.userAuthenticationStatusChecked(true);
			} catch {
				this.props.userAuthenticationStatusChecked(false);
			}
		}
	}

	async componentDidUpdate() {
		if (this.props.isAuthenticated && !this.props.userDetailsAvailable) {
			try {
				const response = await AxiosAPI.privateInstance("/api/users");
				const { username, firstName, lastName, email, contactNumber } = response.data;
				this.props.userDetailsReceived(username, firstName, lastName, email, contactNumber);
			} catch { }
		}
	}

	render() {
		return this.props.authenticationStatusChecked ? this.props.children : <Loading />;
	}
}

function connectStateToProps(state: StoreState, ownProps: any): StateProps {
	return {
		...ownProps,
		isAuthenticated: state.user.isAuthenticated,
		userDetailsAvailable: state.user.userDetailsAvailable,
		authenticationStatusChecked: state.user.authenticationStatusChecked
	};
}

function connectDispatchToProps(dispatch: StoreDispatch): DispatchProps {
	return {
		userAuthenticationStatusChecked: (isAuthenticated: boolean) => dispatch({ type: "AUTHENTICATION_STATUS_CHECKED", isAuthenticated }),
		userDetailsReceived: (username: string, firstName: string, lastName: string, email: string, contactNumber: string) => dispatch({ type: "USER_DETAILS_RECEIVED", username, firstName, lastName, email, contactNumber }),
	}
}

let ServerHelper = connect(connectStateToProps, connectDispatchToProps)(ServerHelperComponent);
export default ServerHelper;