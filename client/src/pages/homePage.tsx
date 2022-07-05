import { Component } from 'react';
import { connect } from 'react-redux';
import { StoreDispatch, StoreState } from '../store/store';

interface StateProps {
	isAuthenticated: boolean;
	firstName: string;
	lastName: string;
}

class DispatchProps {

}

export class HomePageComponent extends Component<StateProps & DispatchProps, any>
{
	render() {
		return (
			<div className="HomePage">
				Welcome to home page.
				<br />
				<br />
				Authenticated: { this.props.isAuthenticated.toString() }
				<br />
				First Name: { this.props.firstName || "NA" }
				<br />
				Last Name: { this.props.lastName || "NA" }
			</div>
		);
	}
}

function connectStateToProps(state: StoreState, ownProps: any): StateProps {
	return {
		...ownProps,
		...state.user
	};
}

function connectDispatchToProps(dispatch: StoreDispatch): DispatchProps {
	return {

	};
}

let HomePage = connect(connectStateToProps, connectDispatchToProps)(HomePageComponent);
export default HomePage;