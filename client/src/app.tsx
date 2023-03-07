import { lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';
import RouteWrapper from './components/routeWrapper';
import Auth from './providers/auth';
import Notification from './providers/notification';
import store from './redux/store';

import "./app.scss";

const HomePage = lazy(() => import('./pages/homePage'));
const NotFoundPage = lazy(() => import('./pages/notFoundPage'));
const SignUpPage = lazy(() => import('./pages/signUpPage'));
const LoginPage = lazy(() => import('./pages/loginPage'));
const ProfilePage = lazy(() => import('./pages/profilePage'));

export default function App() {
	return (
		<HelmetProvider>
			<BrowserRouter>
				<Provider store={ store }>
					<Auth>
						<Notification>
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
								<RouteWrapper path="/" routeType='common' standAlonePage>
									<NotFoundPage />
								</RouteWrapper>
							</Switch>
						</Notification>
					</Auth>
				</Provider>
			</BrowserRouter>
		</HelmetProvider>
	)
}