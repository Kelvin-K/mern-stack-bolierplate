import { Component } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';

interface BasePageProps {
	children: any;
}

export default class BasePage extends Component<BasePageProps, {}>
{
	render() {
		return (
			<>
				<Header />
				{ this.props.children }
				<Footer />
			</>
		);
	}
}