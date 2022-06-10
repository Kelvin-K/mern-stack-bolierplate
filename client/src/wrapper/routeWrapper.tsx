import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import Loading from '../components/loading';
import BasePage from '../pages/basePage';
import { RootState } from '../store/store';

interface OwnProps {
	exact?: boolean | undefined;
	path?: string | readonly string[] | undefined;
	standAlonePage?: boolean;
	routeType: "common" | "public" | "publicOnly" | "private";
	children: React.ReactNode;
}

interface StateProps extends OwnProps {
	isAuthenticated: boolean;
}

export class RouteWrapperComponent extends Component<StateProps, any>
{
	render() {
		if (this.props.routeType === "publicOnly" && this.props.isAuthenticated) {
			return (
				<Redirect to="/" />
			);
		}

		if (this.props.routeType === "private" && !this.props.isAuthenticated) {
			return (
				<Redirect to="/" />
			);
		}

		if (
			this.props.routeType === "common"
			|| this.props.routeType === "public"
			|| (this.props.routeType === "publicOnly" && !this.props.isAuthenticated)
			|| (this.props.routeType === "private" && this.props.isAuthenticated)
		) {
			return (
				<Route exact={this.props.exact} path={this.props.path}>
					<Suspense fallback={<Loading />}>
						{
							this.props.standAlonePage
								? this.props.children
								: <BasePage>{this.props.children}</BasePage>
						}
					</Suspense>
				</Route>
			);
		}
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