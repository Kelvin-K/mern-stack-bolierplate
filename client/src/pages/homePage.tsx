import React, { Component } from 'react';

export default class HomePage extends Component {

	componentDidMount() {
		this.callApi()
			.then(res => console.log(res))
			.catch(err => console.log(err));
	}

	callApi = async () => {
		const response = await fetch('/api/user');
		const body = await response.json();

		return body;
	}

	render() {
		return (
			<div className="HomePage">
				Welcome to home page.
			</div>
		);
	}
}