import { Component } from 'react';
import { Link } from 'react-router-dom';
import "../styles/notFoundPage.scss";

export default class NotFoundPage extends Component {
	render() {
		return (
			<div className="NotFoundPage">
				<div className="code">404</div>
				<div className="meaning">Not Found</div>
				<div className="description">The resource requested could not be found on this server!</div>
				<Link to="/" className="btn btn-primary goHomeButton">GO HOME</Link>
			</div>
		);
	}
}