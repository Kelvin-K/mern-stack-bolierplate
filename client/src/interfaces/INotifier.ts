
interface INotifier {
	showNotification: (message: string, type?: "none" | "success" | "warning" | "error", timeOut?: number) => void;
}

export default INotifier;