import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AxiosAPI from '../helpers/axiosAPI';
import InstanceHelper from '../helpers/instanceHelper';
import CameraImage from "../images/camera.jpg";
import { StoreDispatch, StoreState } from '../store/store';
import "../styles/navBar.scss";

interface StateProps {
	isAuthenticated: boolean;
}

interface DispatchProps {
	loggedOut: () => void;
}

class NavBarState {
	areMenuOptionsVisible: boolean = false;
	windowWidth: number = 0;
}

export class NavBarComponent extends Component<StateProps & DispatchProps, NavBarState> {

	constructor(props: any) {
		super(props);
		this.state = {
			...new NavBarState(),
			windowWidth: window.innerWidth
		};
	}

	componentDidMount() {
		window.addEventListener("resize", () => {
			this.setState({ windowWidth: window.innerWidth });
		})
	}

	handleDocumentClick = () => {
		this.setState({ areMenuOptionsVisible: false });
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
		try {
			const response = await AxiosAPI.instance.delete("/api/logout");
			this.props.loggedOut();
			return InstanceHelper.notifier.showNotification("Logout successful!", "success");
		}
		catch { }
		return InstanceHelper.notifier.showNotification("An internal error occurred. Please contact system administrator.", "warning");
	}

	render() {
		const smallWindow = this.state.windowWidth < 800;
		const sectionVisible = !smallWindow || (smallWindow && this.state.areMenuOptionsVisible);
		return (
			<>
				<nav>
					<div className="nav_wrapper">
						<div className="logo">
							<Link to="/">Mern Stack Boilerplate</Link>
						</div>
						<ul className="nav_links">
							<li><Link to="/">Home</Link></li>
							<li><Link to="/invalid-page">Invalid Page</Link></li>
							<li>
								<Link to="/invalid-page" className='desktop_item'>Dropdown Menu</Link>
								<input type="checkbox" id="showDrop" />
								<label htmlFor="showDrop" className='mobile_item'>Dropdown Menu</label>
								<ul className="drop_menu">
									<li><Link to="/drop-down-1">Drop menu 1</Link></li>
									<li><Link to="/drop-down-2">Drop menu 2</Link></li>
									<li><Link to="/drop-down-3">Drop menu 3</Link></li>
									<li><Link to="/drop-down-4">Drop menu 4</Link></li>
								</ul>
							</li>
							<li>
								<Link to="/invalid-page" className='desktop_item'>Mega Menu</Link>
								<input type="checkbox" id="showMegaMenu" />
								<label htmlFor="showMegaMenu" className='mobile_item'>Mega Menu</label>
								<div className="mega_box">
									<div className="row">
										<img src={ CameraImage } alt="camera" />
									</div>
									<div className="row">
										<header>Design Services</header>
										<ul className="mega_links">
											<li><Link to="/drop-down-5">Graphics</Link></li>
											<li><Link to="/drop-down-6">Vectors</Link></li>
											<li><Link to="/drop-down-7">Business Cards</Link></li>
											<li><Link to="/drop-down-8">Custom logo</Link></li>
										</ul>
									</div>
									<div className="row">
										<header>Email Services</header>
										<ul className="mega_links">
											<li><Link to="/drop-down-5">Personal Email</Link></li>
											<li><Link to="/drop-down-6">Business Email</Link></li>
											<li><Link to="/drop-down-7">Mobile Email</Link></li>
											<li><Link to="/drop-down-8">Web Marketing</Link></li>
										</ul>
									</div>
									<div className="row">
										<header>Security Services</header>
										<ul className="mega_links">
											<li><Link to="/drop-down-5">Site Seal</Link></li>
											<li><Link to="/drop-down-6">VPS Hosting</Link></li>
											<li><Link to="/drop-down-7">Privacy Seal</Link></li>
											<li><Link to="/drop-down-8">Website design</Link></li>
										</ul>
									</div>
								</div>
							</li>
							{
								this.props.isAuthenticated ?
									<>
										<li><Link to="/profile">Profile</Link></li>
										<li><Link to="/logout" onClick={ this.handleLogout }>Logout</Link></li>
									</> :
									<>
										<li><Link to="/signup">Sign Up</Link></li>
										<li><Link to="/login">Login</Link></li>
									</>
							}
						</ul>
					</div>
				</nav>
				<div className="nav_size"></div>
			</>
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

let NavBar = connect(connectStateToProps, connectDispatchToProps)(NavBarComponent);
export default NavBar;