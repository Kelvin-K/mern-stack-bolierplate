import HttpStatusCodes from 'http-status-codes';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { authenticationDetails, DELETE } from '../helpers/requestHelper';
import MenuIcon from "../images/menu.svg";
import { StoreDispatch, StoreState } from '../store/store';
import "../styles/header.scss";

interface StateProps {
	isAuthenticated: boolean;
}

interface DispatchProps {
	loggedOut: () => void;
}

class HeaderState {
	areMenuOptionsVisible: boolean = false;
	windowWidth: number = 0;
}

export class HeaderComponent extends Component<StateProps & DispatchProps, HeaderState> {

	constructor(props: any) {
		super(props);
		this.state = {
			...new HeaderState(),
			windowWidth: window.innerWidth
		};
	}

	componentDidMount() {
		window.addEventListener("resize", () => {
			this.setState({ windowWidth: window.innerWidth });
		})
	}

	handleDocumentClick = () => {
		this.setState(state => ({ areMenuOptionsVisible: false }));
		document.removeEventListener("click", this.handleDocumentClick);
	}

	handleMenuClick = (ev: React.MouseEvent<HTMLImageElement>) => {
		ev.stopPropagation();
		this.setState(state => ({ areMenuOptionsVisible: !state.areMenuOptionsVisible }), () => {
			if (this.state.areMenuOptionsVisible)
				document.addEventListener("click", this.handleDocumentClick);
			else
				document.removeEventListener("click", this.handleDocumentClick);
		});
	};

	handleLogout = async (ev: React.MouseEvent<HTMLAnchorElement>) => {
		ev.preventDefault();
		const response = await DELETE("/api/logout", {});
		if (response.status === HttpStatusCodes.OK) {
			authenticationDetails.accessToken = "";
			this.props.loggedOut();
		}
	}

	render() {
		const smallWindow = this.state.windowWidth < 800;
		return (
			<header className={ smallWindow ? "smallHeader" : "bigHeader" }>
				<Link to="/" className='brand_name'>Mern Stack Boilerplate</Link>
				{
					smallWindow &&
					<img src={ MenuIcon } alt="menu" onClick={ this.handleMenuClick } />
				}
				{
					(!smallWindow || (smallWindow && this.state.areMenuOptionsVisible)) &&
					<section>
						<nav>
							<Link to="/invalid-page">Invalid Page</Link>
						</nav>
						<nav>
							{
								this.props.isAuthenticated
									? (
										<>
											<a href="/logout" onClick={ this.handleLogout }>Logout</a>
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
				}
			</header>
		);
	}
}

function connectStateToProps(state: StoreState, ownProps: any): StateProps {
	return {
		...ownProps,
		isAuthenticated: state.user.isAuthenticated,
	};
}

function connectDispatchToProps(dispatch: StoreDispatch): DispatchProps {
	return {
		loggedOut: () => dispatch({ type: "USER_LOGGED_OUT" }),
	};
}

let Header = connect(connectStateToProps, connectDispatchToProps)(HeaderComponent);
export default Header;