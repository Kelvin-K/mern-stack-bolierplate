import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { DefaultProps } from '../models/defaultProps';
import { StoreDispatch, StoreState } from '../redux/store';

function mapState(state: StoreState, ownProps: DefaultProps) {
	return {
		...ownProps,
	};
}

function mapDispatch(dispatch: StoreDispatch) {
	return {

	}
}

function ProfilePageComponent(props: ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>) {
	return (
		<>
			<Helmet>
				<title>Profile | Mern Stack BoilerPlate</title>
			</Helmet>
			<div className="ProfilePage">

			</div>
		</>

	);
}

const ProfilePage = connect(mapState, mapDispatch)(ProfilePageComponent);
export default ProfilePage;