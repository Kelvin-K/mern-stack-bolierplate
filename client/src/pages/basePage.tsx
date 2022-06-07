import React, { Component, lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loading from '../components/loading';

const HomePage = lazy(() => import('./homePage'));

export default class BasePage extends Component {
	render() {
		return (
			<div className="BasePage">
				<Switch>
					<Route path="/">
						<Suspense fallback={<Loading />}>
							<HomePage />
						</Suspense>
					</Route>
				</Switch>
			</div>
		);
	}
}