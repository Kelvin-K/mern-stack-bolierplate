import Footer from '../components/footer';
import Header from '../components/header';
import NavBar from '../components/navBar';

interface BasePageProps {
	children: any;
}

export default function BasePage(props: BasePageProps) {
	return (
		<>
			<Header />
			<NavBar />
			{ props.children }
			<Footer />
		</>
	);
}