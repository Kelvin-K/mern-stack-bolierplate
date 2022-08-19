import ReactDOM from 'react-dom/client';
import App from './app';
import AxiosAPI from './helpers/axiosAPI';
import './styles/index.scss';

AxiosAPI.initialize();

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<App />
);