import { Component, lazy } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';
import store from './store/store';
import "./styles/app.scss";
import RouteWrapper from './wrapper/routeWrapper';
import ServerHelper from './wrapper/serverHelper';

const HomePage = lazy(() => import('./pages/homePage'));
const NotFoundPage = lazy(() => import('./pages/notFoundPage'));
const SignUpPage = lazy(() => import('./pages/signUpPage'));
const LoginPage = lazy(() => import('./pages/loginPage'));
const ProfilePage = lazy(() => import('./pages/profilePage'));

export default class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Provider store={ store }>
					<ServerHelper>
						<Switch>
							<RouteWrapper path="/signup" routeType='publicOnly'>
								<SignUpPage />
							</RouteWrapper>
							<RouteWrapper path="/login" routeType='publicOnly'>
								<LoginPage />
							</RouteWrapper>
							<RouteWrapper path="/profile" routeType='private'>
								<ProfilePage />
							</RouteWrapper>
							<RouteWrapper exact path="/" routeType='common'>
								<HomePage />
							</RouteWrapper>
							<RouteWrapper path="/" standAlonePage={ true } routeType='common'>
								<NotFoundPage />
							</RouteWrapper>
						</Switch>
					</ServerHelper>
				</Provider>
			</BrowserRouter>
		);
	}
}