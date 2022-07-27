import { Component } from 'react';
import InstanceHelper from '../helpers/instanceHelper';
import BlackCloseIcon from "../images/blackClose.svg";
import WhiteCloseIcon from "../images/whiteClose.svg";
import INotifier from '../interfaces/INotifier';
import "../styles/notifier.scss";

class NotifierState {
	message: string = "";
	type: 'none' | 'success' | 'warning' | 'error' = "none";
	duration: number = 0;
}

export default class Notifier extends Component<any, NotifierState> implements INotifier {

	timer: any;

	constructor(props: any) {
		super(props);
		this.state = new NotifierState();
	}

	componentDidMount() {
		InstanceHelper.notifier = this;
	}

	showNotification = (message: string, type: 'none' | 'success' | 'warning' | 'error' = "none", timeOut: number = 4000) => {
		this.setState({ message, type, duration: timeOut }, () => {
			this.timer = setTimeout(() => {
				this.setState({ message: "", type: "none", duration: 0 })
			}, timeOut);
		});
	}


	closeNotification = () => {
		this.setState({ message: "", type: "none", duration: 0 });
	}

	render() {
		if (!this.state.message)
			return null;

		let style: React.CSSProperties = {
			animationDuration: this.state.duration / 1000 + "s"
		}

		return (
			<div className="notification_holder" style={ style }>
				<div className={ "notification " + this.state.type }>
					<div className="message">{ this.state.message }</div>
					<img src={ this.state.type === "warning" ? BlackCloseIcon : WhiteCloseIcon } alt="close" className="close_notification" onClick={ this.closeNotification } />
				</div>
			</div>
		);
	}
} 