import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { StoreDispatch, StoreState } from '../store/store';
import "../styles/header.scss";

interface StateProps {
	isAuthenticated: boolean;
}

class DispatchProps {

}

export class HeaderComponent extends Component<StateProps & DispatchProps, any> {
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
								? ""
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

	};
}

let Header = connect(connectStateToProps, connectDispatchToProps)(HeaderComponent);
export default Header;