import { connect } from 'react-redux';
import { StoreDispatch, StoreState } from '../store/store';

interface StateProps {
	isAuthenticated: boolean;
	firstName: string;
	lastName: string;
}

class DispatchProps {

}

function HomePage(props: StateProps & DispatchProps) {
	return (
		<div className="HomePage">
			Welcome to home page.
			<br />
			<br />
			Authenticated: { props.isAuthenticated.toString() }
			<br />
			First Name: { props.firstName || "NA" }
			<br />
			Last Name: { props.lastName || "NA" }
		</div>
	);
}

function mapStateToProps(state: StoreState, ownProps: any): StateProps {
	return {
		...ownProps,
		...state.user
	};
}

function mapDispatchToProps(dispatch: StoreDispatch): DispatchProps {
	return {

	};
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);