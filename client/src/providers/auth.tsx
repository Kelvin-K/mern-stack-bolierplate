import { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { refreshAccessToken } from "../api/server";
import Loading from "../components/loading";
import { DefaultProps } from "../models/defaultProps";
import { authenticationStatusChanged } from "../redux/actions/authActions";
import { StoreDispatch, StoreState } from "../redux/store";


function mapState(state: StoreState, ownProps: DefaultProps) {
    return {
        ...ownProps,
    };
}

function mapDispatch(dispatch: StoreDispatch) {
    return {
        authStatusChanged: (status: boolean) => dispatch(authenticationStatusChanged(status)),
    }
}

function AuthComponent(props: ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>) {

    const [statusChecked, setStatusChecked] = useState(false);

    const checkAuthStatus = async () => {
        const accessToken = await refreshAccessToken();
        if (accessToken)
            props.authStatusChanged(true);
        setStatusChecked(true);
    }

    useEffect(() => {
        checkAuthStatus();
    }, []);

    if (!statusChecked)
        return (
            <div className="full_page">
                <div className="fullSizeCenterContainer">
                    <Loading />
                </div>
            </div>
        );

    return <>{props.children}</>;
}

const Auth = connect(mapState, mapDispatch)(AuthComponent);

export default Auth;