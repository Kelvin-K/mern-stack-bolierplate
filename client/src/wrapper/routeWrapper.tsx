import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RootState } from '../store/store';

interface OwnProps {
	routeType: "common" | "public" | "publicOnly" | "private";
	children: React.ReactNode;
}

interface StateProps extends OwnProps {
	isAuthenticated: boolean;
}

export class RouteWrapperComponent extends Component<StateProps, any>
{
	render() {
		if (
			this.props.routeType === "common"
			|| this.props.routeType === "public"
			|| (this.props.routeType === "publicOnly" && !this.props.isAuthenticated)
			|| (this.props.routeType === "private" && this.props.isAuthenticated)
		)
			return this.props.children;

		if (this.props.routeType === "publicOnly" && this.props.isAuthenticated)
			return (
				<Redirect to="/" />
			);

		if (this.props.routeType === "private" && !this.props.isAuthenticated)
			return (
				<Redirect to="/" />
			);
	}
}

function connectStateToProps(state: RootState, ownProps: OwnProps): StateProps {
	return {
		...ownProps,
		isAuthenticated: state.user.isAuthenticated
	};
}

let RouteWrapper = connect(connectStateToProps,)(RouteWrapperComponent);
export default RouteWrapper;