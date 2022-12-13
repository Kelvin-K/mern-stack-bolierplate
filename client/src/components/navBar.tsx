import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import CameraImage from "../images/camera.jpg";
import { APIContext } from '../providers/APIProvider';
import { NotificationContext } from '../providers/NotificationProvider';
import { StoreDispatch, StoreState } from '../store/store';
import "../styles/navBar.scss";

interface StateProps {
	isAuthenticated: boolean;
}

interface DispatchProps {
	loggedOut: () => void;
}

function NavBar(props: StateProps & DispatchProps) {
	const notifier = React.useContext(NotificationContext);
	const api = React.useContext(APIContext);

	const handleLogout = async (ev: React.MouseEvent<HTMLAnchorElement>) => {
		ev.preventDefault();
		try {
			await api.instance.delete("/api/logout");
			props.loggedOut();
			return notifier.showNotification("Logout successful!", "success");
		}
		catch { }
		return notifier.showNotification("An internal error occurred. Please contact system administrator.", "warning");
	}

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
							props.isAuthenticated ?
								<>
									<li><Link to="/profile">Profile</Link></li>
									<li><Link to="/logout" onClick={ handleLogout }>Logout</Link></li>
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

function mapStateToProps(state: StoreState, ownProps: any): StateProps {
	return {
		...ownProps,
		isAuthenticated: state.user.isAuthenticated,
	};
}

function mapDispatchToProps(dispatch: StoreDispatch): DispatchProps {
	return {
		loggedOut: () => dispatch({ type: "USER_LOGGED_OUT" }),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);