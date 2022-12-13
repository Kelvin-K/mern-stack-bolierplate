import { createContext, useState } from "react";
import BlackCloseIcon from "../images/blackClose.svg";
import WhiteCloseIcon from "../images/whiteClose.svg";

interface INotificationProviderProps {
	children: React.ReactNode
}

export const NotificationContext = createContext({
	showNotification: (message: string, type: 'none' | 'success' | 'warning' | 'error' = "none", timeOut?: number) => { },
});

export default function NotificationProvider(props: INotificationProviderProps) {
	const [state, setState] = useState({
		message: "",
		type: "none",
		duration: 0
	});

	const showNotification = (message: string, type: 'none' | 'success' | 'warning' | 'error' = "none", timeOut: number = 4000) => {
		setState({ message, type, duration: timeOut });
		setTimeout(() => {
			setState({ message: "", type: "none", duration: 0 })
		}, timeOut);
	}

	const closeNotification = () => {
		setState({ message: "", type: "none", duration: 0 });
	}

	let style: React.CSSProperties = {
		animationDuration: state.duration / 1000 + "s"
	}

	return (
		<NotificationContext.Provider value={ { showNotification } }>
			<>
				{ props.children }
				{
					state.message &&
					<div className="notification_holder" style={ style }>
						<div className={ "notification " + state.type }>
							<div className="message">{ state.message }</div>
							<img src={ state.type === "warning" ? BlackCloseIcon : WhiteCloseIcon } alt="close" className="close_notification" onClick={ closeNotification } />
						</div>
					</div>
				}
			</>
		</NotificationContext.Provider>
	);
}