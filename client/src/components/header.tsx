import { Component } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RootState } from '../store/store';

interface StateProps {

}

class DispatchProps {

}

export class HeaderComponent extends Component<StateProps & DispatchProps, any> {
	render() {
		return (
			<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
				<Navbar.Brand href="/home">React-Bootstrap</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link href="/features">Features</Nav.Link>
						<Nav.Link href="/pricing">Pricing</Nav.Link>
						<NavDropdown title="Dropdown" id="collasible-nav-dropdown">
							<NavDropdown.Item href="/action/3.1">Action</NavDropdown.Item>
							<NavDropdown.Item href="/action/3.2">Another action</NavDropdown.Item>
							<NavDropdown.Item href="/action/3.3">Something</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href="/action/3.4">Separated link</NavDropdown.Item>
						</NavDropdown>
					</Nav>
					<Nav>
						<Nav.Link href="/deets">More deets</Nav.Link>
						<Nav.Link eventKey={2} href="/memes">
							Dank memes
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

function connectStateToProps(state: RootState, ownProps: any): StateProps {
	return {
		...ownProps,
	};
}

function connectDispatchToProps(dispatch: any): DispatchProps {
	return bindActionCreators({ ...new DispatchProps() }, dispatch);
}

let Header = connect(connectStateToProps, connectDispatchToProps)(HeaderComponent);
export default Header;