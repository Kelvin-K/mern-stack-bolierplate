import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import "./notFoundPage.scss";

export default function NotFoundPage() {
	return (
		<>
			<Helmet>
				<title>Not Found | Mern Stack BoilerPlate</title>
			</Helmet>
			<div className="NotFoundPage">
				<div className="content">
					<div className="code">404</div>
					<div className="meaning">Not Found</div>
					<div className="description">The resource requested could not be found on this server!</div>
					<Link to="/">
						<button className="btn btn-primary goHomeButton">
							GO HOME
						</button>
					</Link>
				</div>
			</div>
		</>

	);
}