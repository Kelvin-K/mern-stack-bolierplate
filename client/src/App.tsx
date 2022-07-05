import { Component, lazy } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';
import store from './store/store';
import "./styles/app.scss";
import RouteWrapper from './wrapper/routeWrapper';

const HomePage = lazy(() => import('./pages/homePage'));
const NotFoundPage = lazy(() => import('./pages/notFoundPage'));

export default class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Provider store={ store }>
					<Switch>
						<RouteWrapper exact path="/" routeType='common'>
							<HomePage />
						</RouteWrapper>
						<RouteWrapper path="/" standAlonePage={ true } routeType='common'>
							<NotFoundPage />
						</RouteWrapper>
					</Switch>
				</Provider>
			</BrowserRouter>
		);
	}
}