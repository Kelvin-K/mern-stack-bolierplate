import Footer from '../components/footer';
import NavBar from '../components/navBar';
import { DefaultProps } from '../models/defaultProps';

import "./basePage.scss";

export default function BasePage(props: DefaultProps) {
	return (
		<>
			<NavBar />
			<div className="pageContent">
				{ props.children }
			</div>
			<Footer />
		</>
	);
}