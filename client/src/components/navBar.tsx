import { useContext } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { server } from '../api/server';
import CameraImage from "../images/camera.jpg";
import { DefaultProps } from '../models/defaultProps';
import { NotificationContext } from '../providers/notification';
import { userLoggedOut } from '../redux/actions/userActions';
import { StoreDispatch, StoreState } from '../redux/store';

import "./navBar.scss";

function mapState(state: StoreState, ownProps: DefaultProps) {
	return {
		...ownProps,
		isAuthenticated: state.auth.isAuthenticated,
	};
}

function mapDispatch(dispatch: StoreDispatch) {
	return {
		userLoggedOut: () => dispatch(userLoggedOut()),
	}
}

function NavBarComponent(props: ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>) {
	const notifier = useContext(NotificationContext);

	const handleLogout = async (ev: React.MouseEvent) => {
		ev.preventDefault();
		try {
			await server.delete("/api/logout");
			localStorage.removeItem("accessToken");
			props.userLoggedOut();
			return notifier.showNotification("Logout successful!", "success");
		} catch (error) {
			return notifier.showNotification("An internal error occurred. Please contact system administrator.", "warning");
		}
	};

	return (
		<nav>
			<div className="wrapper">
				<div className="logo"><Link to="#">Mern Stack Bolierplate</Link></div>
				<input type="radio" name="slider" id="menu-btn" />
				<input type="radio" name="slider" id="close-btn" />
				<ul className="nav-links">
					<label htmlFor="close-btn" className="btn close-btn"><i className="fas fa-times"></i></label>
					<li><Link to="/">Home</Link></li>
					<li><Link to="/about">About</Link></li>
					<li>
						<Link to="#" className="desktop-item">Dropdown Menu</Link>
						<input type="checkbox" id="showDrop" />
						<label htmlFor="showDrop" className="mobile-item">Dropdown Menu</label>
						<ul className="drop-menu">
							<li><Link to="/drop-menu-1">Drop menu 1</Link></li>
							<li><Link to="/drop-menu-2">Drop menu 2</Link></li>
							<li><Link to="/drop-menu-3">Drop menu 3</Link></li>
							<li><Link to="/drop-menu-4">Drop menu 4</Link></li>
						</ul>
					</li>
					<li>
						<Link to="#" className="desktop-item">Mega Menu</Link>
						<input type="checkbox" id="showMega" />
						<label htmlFor="showMega" className="mobile-item">Mega Menu</label>
						<div className="mega-box">
							<div className="content">
								<div className="row">
									<img src={ CameraImage } alt="" />
								</div>
								<div className="row">
									<header>Design Services</header>
									<ul className="mega-links">
										<li><Link to="/mega-link-1">Graphics</Link></li>
										<li><Link to="/mega-link-2">Vectors</Link></li>
										<li><Link to="/mega-link-3">Business cards</Link></li>
										<li><Link to="/mega-link-4">Custom logo</Link></li>
									</ul>
								</div>
								<div className="row">
									<header>Email Services</header>
									<ul className="mega-links">
										<li><Link to="/mega-link-5">Personal Email</Link></li>
										<li><Link to="/mega-link-6">Business Email</Link></li>
										<li><Link to="/mega-link-7">Mobile Email</Link></li>
										<li><Link to="/mega-link-8">Web Marketing</Link></li>
									</ul>
								</div>
								<div className="row">
									<header>Security services</header>
									<ul className="mega-links">
										<li><Link to="/mega-link-9">Site Seal</Link></li>
										<li><Link to="/mega-link-10">VPS Hosting</Link></li>
										<li><Link to="/mega-link-11">Privacy Seal</Link></li>
										<li><Link to="/mega-link-12">Website design</Link></li>
									</ul>
								</div>
							</div>
						</div>
					</li>
					<li><Link to="#">Feedback</Link></li>
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
				<label htmlFor="menu-btn" className="btn menu-btn"><i className="fas fa-bars"></i></label>
			</div>
		</nav>
	);
}

const NavBar = connect(mapState, mapDispatch)(NavBarComponent);
export default NavBar;