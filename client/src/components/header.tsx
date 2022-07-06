import HttpStatusCodes from 'http-status-codes';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { authenticationDetails, Fetch } from '../helpers/requestHelper';
import { StoreDispatch, StoreState } from '../store/store';
import "../styles/header.scss";

interface StateProps {
	isAuthenticated: boolean;
}

interface DispatchProps {
	loggedOut: () => void;
}

export class HeaderComponent extends Component<StateProps & DispatchProps, any> {

	handleLogout = async (ev: React.MouseEvent<HTMLAnchorElement>) => {
		ev.preventDefault();
		console.log(authenticationDetails.authToken);
		const response = await Fetch("/api/authenticate/logout", { method: "POST" });
		if (response.status === HttpStatusCodes.OK) {
			authenticationDetails.authToken = "";
			this.props.loggedOut();
		}
	}

	render() {
		return (
			<header>
				<Link to="/" className='brand_name'>Mern Stack Boilerplate</Link>
				<section>
					<nav>
						<Link to="/features">Features</Link>
						<Link to="/pricing">Pricing</Link>
					</nav>
					<nav>
						{
							this.props.isAuthenticated
								? (
									<>
										<a href="#" onClick={ this.handleLogout }>Logout</a>
									</>
								)
								: (
									<>
										<Link to="/signup">Sign Up</Link>
										<Link to="/login">Login</Link>
									</>
								)
						}
					</nav>
				</section>
			</header>
		);
	}
}

function connectStateToProps(state: StoreState, ownProps: any): StateProps {
	return {
		...ownProps,
		isAuthenticated: state.user.isAuthenticated
	};
}

function connectDispatchToProps(dispatch: StoreDispatch): DispatchProps {
	return {
		loggedOut: () => dispatch({ type: "USER_LOGGED_OUT" })
	};
}

let Header = connect(connectStateToProps, connectDispatchToProps)(HeaderComponent);
export default Header;