import { Component, lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loading from '../components/loading';
import RouteWrapper from '../wrapper/routeWrapper';

const HomePage = lazy(() => import('./homePage'));
const NotFoundPage = lazy(() => import('./notFoundPage'));

export default class BasePage extends Component {
	render() {
		return (
			<div className="BasePage">
				<Switch>
					<Route exact path="/">
						<RouteWrapper routeType='common'>
							<Suspense fallback={<Loading />}>
								<HomePage />
							</Suspense>
						</RouteWrapper>
					</Route>
					<Route path="/">
						<RouteWrapper routeType='common'>
							<Suspense fallback={<Loading />}>
								<NotFoundPage />
							</Suspense>
						</RouteWrapper>
					</Route>
				</Switch>
			</div>
		);
	}
}