type PromiseResponse = ReturnType<typeof fetch>;

const authenticationDetails = {
	authToken: ""
};

export const Fetch = (input: RequestInfo | URL, init?: RequestInit | undefined): PromiseResponse => {
	if (!init) {
		init = {};
	}
	if (!init.headers) {
		init.headers = new Headers();
	}

	if (authenticationDetails.authToken) {
		if (init.headers instanceof Headers) {
			init.headers.append('Auth', `Bearer ${authenticationDetails.authToken}`);
		}
	}

	if (init?.method !== "GET") {
		if (init.headers instanceof Headers) {
			init.headers.append('Content-Type', `application/json`);
		}
	}

	return fetch(input, init);
};