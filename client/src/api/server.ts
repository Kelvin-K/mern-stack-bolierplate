import axios from 'axios';

export const refreshAccessToken = async () => {
    try {
        const response = await axios.post("/api/refresh-token");
        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", response.data.accessToken);
        return accessToken;
    }
    catch (error) {
        return null;
    }
}

export const server = axios.create();

// Request interceptor for API calls
server.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem("accessToken");;
        config.headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        return config;
    },
    error => {
        Promise.reject(error)
    }
);

// Response interceptor for API calls
server.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            const accessToken = await refreshAccessToken();
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
            return server(originalRequest);
        }
        return Promise.reject(error);
    }
);
