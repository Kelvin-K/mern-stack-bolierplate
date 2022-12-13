import axios from "axios";
import HttpStatusCodes from 'http-status-codes';
import { createContext, useEffect } from "react";
import { connect } from "react-redux";
import { StoreDispatch, StoreState } from "../store/store";

interface IAPIProviderStateProps {
	access_token: string;
	children: React.ReactNode;
}

interface IAPIProviderDispatchProps {
	setAccessToken: (access_token: string) => void;
	logOut: () => void;
}

export const APIContext = createContext({
	instance: axios.create(),
	privateInstance: axios.create(),
	refreshAccessToken: async () => { },
});

function APIProvider(props: IAPIProviderStateProps & IAPIProviderDispatchProps) {
	let instance = axios.create();
	let privateInstance = axios.create();

	useEffect(() => {
		privateInstance.interceptors.request.use(
			async config => {
				const access_token = props.access_token;
				config.headers = {
					'Authorization': `Bearer ${access_token}`,
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
				return config;
			},
			error => {
				Promise.reject(error)
			}
		);

		privateInstance.interceptors.response.use(response => response, async function (error) {
			const originalRequest = error.config;
			if (error.response.status === HttpStatusCodes.UNAUTHORIZED && !originalRequest._retry) {
				originalRequest._retry = true;
				try {
					const access_token = await refreshAccessToken();
					axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
					return privateInstance(originalRequest);
				}
				catch (error) {
					return Promise.reject(error);
				}
			}
			return Promise.reject(error);
		});
	}, []);

	const refreshAccessToken = async () => {
		try {
			let response = await instance.post("/api/refresh-token")
			let access_token = response.data.accessToken;
			props.setAccessToken(access_token);
			return access_token;

		} catch (error) {
			props.logOut();
			throw new Error("Token expired");
		}
	}

	const contextValue = {
		instance,
		privateInstance,
		refreshAccessToken
	}

	return (
		<APIContext.Provider value={ contextValue }>
			{ props.children }
		</APIContext.Provider>
	);
}

function mapStateToProps(state: StoreState, ownProps: any): IAPIProviderStateProps {
	return {
		access_token: state.user.access_token,
		...ownProps,
	};
}

function mapDispatchToProps(dispatch: StoreDispatch): IAPIProviderDispatchProps {
	return {
		setAccessToken: (access_token: string) => dispatch({ type: "SET_ACCESS_TOKEN", access_token }),
		logOut: () => dispatch({ type: "USER_LOGGED_OUT" }),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(APIProvider);