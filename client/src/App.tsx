import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import BasePage from './pages/basePage';
import store from './store/store';
import "./styles/components/App.scss";

export default class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Provider store={store}>
					<BasePage />
				</Provider>
			</BrowserRouter>
		);
	}
}