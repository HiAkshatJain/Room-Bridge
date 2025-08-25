import axios, { AxiosInstance } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8081';

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, 
});


let inMemoryToken: string | null = null;

export function setAccessToken(token: string | null) {
    inMemoryToken = token;
    console.log('Access token set:', token ? '****' : 'null');
}

export function clearAccessToken() {
    inMemoryToken = null;
}

function getAccessToken() {
    console.log('Access token set:', inMemoryToken ? '****' : 'null');
    return inMemoryToken;
    
}


api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers = config.headers ?? {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;
        if (!originalRequest) return Promise.reject(error);

      
        if (originalRequest._retry) return Promise.reject(error);

        const status = error?.response?.status;
        const message = error?.response?.data?.message || '';

   
    if (status === 401 || status === 403) {
            originalRequest._retry = true;
            try {
               
                const refreshRes = await axios.post(`${BASE_URL}/auth/refresh`,{ refreshToken: getRefreshTokenFromStorageOrCookie() }, { withCredentials: true });
                const newToken = refreshRes?.data?.accessToken;
                if (newToken) {
                    setAccessToken(newToken);
                    originalRequest.headers = originalRequest.headers ?? {};
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshErr) {
                
                setAccessToken(null);
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

function getRefreshTokenFromStorageOrCookie(): any {
    throw new Error('Function not implemented.');
}
