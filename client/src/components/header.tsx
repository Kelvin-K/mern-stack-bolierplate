import { Component } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { StoreDispatch, StoreState } from '../store/store';

interface StateProps {
	isAuthenticated: boolean;
}

class DispatchProps {

}

export class HeaderComponent extends Component<StateProps & DispatchProps, any> {
	render() {
		return (
			<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
				<Navbar.Brand as={ Link } to="/">React-Bootstrap</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link as={ Link } to="/features">Features</Nav.Link>
						<Nav.Link as={ Link } to="/pricing">Pricing</Nav.Link>
						<NavDropdown title="Dropdown" id="collasible-nav-dropdown">
							<NavDropdown.Item as={ Link } to="/action/3.1">Action</NavDropdown.Item>
							<NavDropdown.Item as={ Link } to="/action/3.2">Another action</NavDropdown.Item>
							<NavDropdown.Item as={ Link } to="/action/3.3">Something</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item as={ Link } to="/action/3.4">Separated link</NavDropdown.Item>
						</NavDropdown>
					</Nav>
					<Nav>
						{
							this.props.isAuthenticated
								? ""
								: (
									<>
										<Nav.Link as={ Link } to="/signup">Sign Up</Nav.Link>
										<Nav.Link as={ Link } to="/login">Login</Nav.Link>
									</>
								)
						}
					</Nav>
				</Navbar.Collapse>
			</Navbar>
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
	return bindActionCreators({ ...new DispatchProps() }, dispatch);
}

let Header = connect(connectStateToProps, connectDispatchToProps)(HeaderComponent);
export default Header;