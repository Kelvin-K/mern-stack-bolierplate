import { Component } from 'react';
import { connect } from 'react-redux';
import { StoreDispatch, StoreState } from '../store/store';

interface StateProps {

}

interface DispatchProps {

}

export class ProfilePageComponent extends Component<StateProps & DispatchProps, any>
{
	render() {
		return (
			<div className="ProfilePage">

			</div>
		);
	}
}

function connectStateToProps(state: StoreState, ownProps: any): StateProps {
	return {
		...ownProps,
	};
}

function connectDispatchToProps(dispatch: StoreDispatch): DispatchProps {
	return {

	}
}

let ProfilePage = connect(connectStateToProps, connectDispatchToProps)(ProfilePageComponent);
export default ProfilePage;