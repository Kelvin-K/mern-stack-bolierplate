import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Loading from '../components/loading';
import { APIContext } from '../providers/APIProvider';
import { StoreDispatch, StoreState } from '../store/store';

interface StateProps {
	isAuthenticated: boolean;
	userDetailsAvailable: boolean;
	authStatusChecked: boolean;
	children: any;
}

interface DispatchProps {
	userAuthenticationStatusChecked: (isAuthenticated: boolean) => void;
	userDetailsReceived: (username: string, firstName: string, lastName: string, email: string, contactNumber: string) => void;
}

function ServerHelper(props: StateProps & DispatchProps) {
	const api = React.useContext(APIContext);

	useEffect(() => {
		if (!props.authStatusChecked) {
			api.refreshAccessToken()
				.then(() => {
					props.userAuthenticationStatusChecked(true);
				})
				.catch(() => {
					props.userAuthenticationStatusChecked(false);
				});
		}
		if (props.isAuthenticated && !props.userDetailsAvailable) {
			api.privateInstance("/api/users")
				.then(response => {
					const { username, firstName, lastName, email, contactNumber } = response.data;
					props.userDetailsReceived(username, firstName, lastName, email, contactNumber);
				})
		}
	});

	return props.authStatusChecked ? props.children : <Loading />;
}

function mapStateToProps(state: StoreState, ownProps: any): StateProps {
	return {
		...ownProps,
		isAuthenticated: state.user.isAuthenticated,
		userDetailsAvailable: state.user.userDetailsAvailable,
		authStatusChecked: state.user.authenticationStatusChecked
	};
}

function mapDispatchToProps(dispatch: StoreDispatch): DispatchProps {
	return {
		userAuthenticationStatusChecked: (isAuthenticated: boolean) => dispatch({ type: "AUTHENTICATION_STATUS_CHECKED", isAuthenticated }),
		userDetailsReceived: (username: string, firstName: string, lastName: string, email: string, contactNumber: string) => dispatch({ type: "USER_DETAILS_RECEIVED", username, firstName, lastName, email, contactNumber }),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ServerHelper);