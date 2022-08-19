import axios from "axios";
import HttpStatusCodes from 'http-status-codes';
import store from "../store/store";

class AxiosAPI {
	static instance = axios.create();
	static privateInstance = axios.create();

	static initialize = () => {
		AxiosAPI.privateInstance.interceptors.request.use(
			async config => {
				const access_token = store.getState().user.access_token;
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

		AxiosAPI.privateInstance.interceptors.response.use(response => response, async function (error) {
			const originalRequest = error.config;
			if (error.response.status === HttpStatusCodes.UNAUTHORIZED && !originalRequest._retry) {
				originalRequest._retry = true;
				try {
					const access_token = await AxiosAPI.refreshAccessToken();
					axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
					return AxiosAPI.privateInstance(originalRequest);
				}
				catch (error) {
					return Promise.reject(error);
				}
			}
			return Promise.reject(error);
		});
	}

	static refreshAccessToken = async () => {
		try {
			let response = await AxiosAPI.instance.post("/api/refresh-token")
			let access_token = response.data.accessToken;
			store.dispatch({ type: "SET_ACCESS_TOKEN", access_token });
			return access_token;

		} catch (error) {
			store.dispatch({ type: "USER_LOGGED_OUT" });
			throw new Error("Token expired");
		}
	}
}

export default AxiosAPI;