import HttpStatusCodes from 'http-status-codes';
type PromiseResponse = ReturnType<typeof fetch>;

export const authenticationDetails = {
	authToken: ""
};

export const Fetch = async (input: RequestInfo | URL, init?: RequestInit | undefined): PromiseResponse => {
	if (!init) {
		init = {};
	}

	if (!init.headers) {
		init.headers = new Headers();
	}

	if (init.headers instanceof Headers) {
		if (authenticationDetails.authToken)
			init.headers.append('Auth', `Bearer ${authenticationDetails.authToken}`);

		if (init?.method !== "GET" && !init.headers.get('Content-Type'))
			init.headers.append('Content-Type', `application/json`);
	}

	const response = await fetch(input, init);
	if (response.status === HttpStatusCodes.UNAUTHORIZED) {
		const refreshTokenResponse = await fetch("/api/authenticate/refresh-token", {
			method: "POST"
		});
		const refreshTokenBody = await refreshTokenResponse.json();
		authenticationDetails.authToken = refreshTokenBody.authToken;
		return Fetch(input, init);
	}
	else {
		return new Promise((resolve, reject) => {
			resolve(response);
		})
	}
};