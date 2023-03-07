import { Suspense } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { DefaultProps } from '../models/defaultProps';
import BasePage from '../pages/basePage';
import { StoreDispatch, StoreState } from '../redux/store';
import Loading from './loading';

interface RouteWrapperProps extends DefaultProps {
	routeType: "common" | "public" | "publicOnly" | "private";
	exact?: boolean | undefined;
	path?: string | readonly string[] | undefined;
	standAlonePage?: boolean;
	redirectRoute?: string;
}

function mapState(state: StoreState, ownProps: RouteWrapperProps) {
	return {
		...ownProps,
		isAuthenticated: state.auth.isAuthenticated,
	};
}

function mapDispatch(dispatch: StoreDispatch) {
	return {

	}
}

function RouteWrapperComponent(props: ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>) {

	if ((props.routeType === "publicOnly" && props.isAuthenticated) || (props.routeType === "private" && !props.isAuthenticated)) {
		return <Redirect to={props.redirectRoute || "/"} />;
	}

	return (
		<Route exact={props.exact} path={props.path}>
			<Suspense fallback={<Loading />}>
				{
					props.standAlonePage
						? props.children
						: <BasePage>{props.children}</BasePage>
				}
			</Suspense>
		</Route>
	);
}

const RouteWrapper = connect(mapState, mapDispatch)(RouteWrapperComponent);
export default RouteWrapper;