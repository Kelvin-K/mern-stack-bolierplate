import { Component } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';

export default class BasePage extends Component<any, any> {
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