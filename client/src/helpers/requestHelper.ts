import HttpStatusCodes from 'http-status-codes';
type PromiseResponse = ReturnType<typeof fetch>;

export const authenticationDetails = {
	accessToken: ""
};

const getCommonHeaders = (existingHeaders: any, hasContent: boolean) => {
	let newHeaders = {
		...existingHeaders
	};
	if (hasContent && !newHeaders["content-type"])
		newHeaders["content-type"] = "application/json";

	if (authenticationDetails.accessToken)
		newHeaders["Authorization"] = `Bearer ${authenticationDetails.accessToken}`;

	return newHeaders;
}

const createRequest = async (url: string, method: string, headers: any, hasBody: boolean = false, body: string = ""): Promise<PromiseResponse> => {

	const getOptions = (headers: any) => {
		let options: any = {
			method,
			headers
		}
		if (hasBody) options = { ...options, body }
		return options;
	}

	const response = await fetch(url, getOptions(headers));
	if (!authenticationDetails.accessToken || response.status !== HttpStatusCodes.UNAUTHORIZED)
		return new Promise(resolve => resolve(response));

	const refreshTokenResponse = await fetch("/api/refresh-token", { method: "POST" });
	if (refreshTokenResponse.status !== HttpStatusCodes.OK)
		return new Promise(resolve => resolve(response));

	const { accessToken } = await refreshTokenResponse.json();
	authenticationDetails.accessToken = accessToken;

	return fetch(url, getOptions(getCommonHeaders(headers, hasBody)));
}

export const GET = async (url: string, headers: any = {}) => await createRequest(url, "GET", getCommonHeaders(headers, false));
export const POST = async (url: string, body: any, headers: any = {}) => await createRequest(url, "POST", getCommonHeaders(headers, true), true, JSON.stringify(body));
export const PUT = async (url: string, body: any, headers: any = {}) => await createRequest(url, "PUT", getCommonHeaders(headers, true), true, JSON.stringify(body));
export const DELETE = async (url: string, body: any, headers: any = {}) => await createRequest(url, "DELETE", getCommonHeaders(headers, true), true, JSON.stringify(body));