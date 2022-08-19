import { Component } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import NavBar from '../components/navBar';

interface BasePageProps {
	children: any;
}

export default class BasePage extends Component<BasePageProps, {}>
{
	render() {
		return (
			<>
				<Header />
				<NavBar />
				{ this.props.children }
				<Footer />
			</>
		);
	}
}