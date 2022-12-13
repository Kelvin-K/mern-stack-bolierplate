import { connect } from 'react-redux';
import { StoreDispatch, StoreState } from '../store/store';

interface StateProps {

}

interface DispatchProps {

}


function ProfilePage(props: StateProps & DispatchProps) {
	return (
		<div className="ProfilePage">

		</div>
	)
}

function mapStateToProps(state: StoreState, ownProps: any): StateProps {
	return {
		...ownProps,
	};
}

function mapDispatchToProps(dispatch: StoreDispatch): DispatchProps {
	return {

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);