import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RootState } from '../store/store';

interface StateProps {

}

class DispatchProps {

}

export class HeaderComponent extends Component<StateProps & DispatchProps, any>
{
	render() {
		return (
			<header>
				Header
			</header>
		);
	}
}

function connectStateToProps(state: RootState, ownProps: any): StateProps {
	return {
		...ownProps,
	};
}

function connectDispatchToProps(dispatch: any): DispatchProps {
	return bindActionCreators({ ...new DispatchProps() }, dispatch);
}

let Header = connect(connectStateToProps, connectDispatchToProps)(HeaderComponent);
export default Header;