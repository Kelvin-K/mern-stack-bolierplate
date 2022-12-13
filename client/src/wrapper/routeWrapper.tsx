import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import Loading from '../components/loading';
import BasePage from '../pages/basePage';
import { StoreState } from '../store/store';

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

function RouteWrapper(props: StateProps) {
	if ((props.routeType === "publicOnly" && props.isAuthenticated) || (props.routeType === "private" && !props.isAuthenticated)) {
		return <Redirect to="/" />;
	}

	return (
		<Route exact={ props.exact } path={ props.path }>
			<Suspense fallback={ <Loading /> }>
				{
					props.standAlonePage
						? props.children
						: <BasePage>{ props.children }</BasePage>
				}
			</Suspense>
		</Route>
	);
}

function mapStateToProps(state: StoreState, ownProps: OwnProps): StateProps {
	return {
		...ownProps,
		isAuthenticated: state.user.isAuthenticated
	};
}

export default connect(mapStateToProps)(RouteWrapper);