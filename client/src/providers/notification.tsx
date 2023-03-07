import { createContext, useState } from "react";
import BlackCloseIcon from "../images/blackClose.svg";
import WhiteCloseIcon from "../images/whiteClose.svg";
import { DefaultProps } from "../models/defaultProps";
import { generateUUID } from "../utility";

import "./notification.scss";

export const NotificationContext = createContext({
	showNotification: (message: string, type: 'none' | 'success' | 'warning' | 'error', duration?: number) => { },
});

export default function Notification(props: DefaultProps) {
	const [notifications, setNotifications] = useState<{ id: any; message: string; type: "none" | "success" | "warning" | "error"; duration: number; }[]>([])

	const showNotification = (message: string, type: 'none' | 'success' | 'warning' | 'error' = "none", duration: number = 4000) => {
		const notification = { id: generateUUID(), message, type, duration };
		setNotifications(prevState => {
			return [
				...prevState,
				notification
			]
		});
		setTimeout(() => {
			closeNotification(notification);
		}, notification.duration);
	}

	const closeNotification = (notification) => {
		setNotifications(prevState => prevState.filter(it => it.id !== notification.id));
	}

	return (
		<NotificationContext.Provider value={ { showNotification } }>
			<>
				{ props.children }
				<div className="notification_area">
					{
						notifications.map(notification => (
							<div key={ notification.id } className={ "notification " + notification.type } style={ { animationDuration: notification.duration / 1000 + "s" } }>
								<div className="message">{ notification.message }</div>
								<img src={ notification.type === "warning" ? BlackCloseIcon : WhiteCloseIcon } alt="close" className="close_notification" onClick={ closeNotification } />
							</div>
						))
					}
				</div>
			</>
		</NotificationContext.Provider>
	);
}