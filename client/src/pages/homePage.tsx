import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { DefaultProps } from '../models/defaultProps';
import { StoreDispatch, StoreState } from '../redux/store';

import "./homePage.scss";

function mapState(state: StoreState, ownProps: DefaultProps) {
	return {
		...ownProps,
		isAuthenticated: state.auth.isAuthenticated,
		firstName: state.user.firstName,
		lastName: state.user.lastName
	};
}

function mapDispatch(dispatch: StoreDispatch) {
	return {

	}
}

function HomePageComponent(props: ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>) {
	return (
		<>
			<Helmet>
				<title>Home | Mern Stack BoilerPlate</title>
			</Helmet>
			<div className="fullSizeCenterContainer">
				<div className="HomePage">
					Welcome to home page.
					<br />
					<br />
					Authenticated: { props.isAuthenticated.toString() }
					<br />
					First Name: { props.firstName || "NA" }
					<br />
					Last Name: { props.lastName || "NA" }
				</div>
			</div>
		</>
	);
}

const HomePage = connect(mapState, mapDispatch)(HomePageComponent);
export default HomePage;