import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import BasePage from '../pages/basePage';

export default class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<BasePage />
			</BrowserRouter>
		);
	}
}