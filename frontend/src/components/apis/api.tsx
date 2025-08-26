import axios, { AxiosInstance } from "axios";
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8081";
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
let inMemoryToken: string | null = null;
export function setAccessToken(token: string | null) {
  inMemoryToken = token;
  
}
export function clearAccessToken() {
  inMemoryToken = null;
}
function getAccessToken() {
  
  return inMemoryToken;
}
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Single in-flight refresh promise to deduplicate concurrent refresh calls
let refreshPromise: Promise<string | null> | null = null;

// Broadcast new tokens to other tabs
let bc: BroadcastChannel | null = null;
try {
  bc = new BroadcastChannel('auth-tokens');
  bc.addEventListener('message', (ev) => {
    if (ev.data?.type === 'NEW_ACCESS_TOKEN' && ev.data?.token) {
      setAccessToken(ev.data.token);
    }
  });
} catch (e) {
  bc = null;
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      // backend reads refresh token from HttpOnly cookie; POST body can be empty
      const res = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
      const newToken = res?.data?.accessToken ?? null;
      if (newToken && bc) {
        try { bc.postMessage({ type: 'NEW_ACCESS_TOKEN', token: newToken }); } catch (e) {}
      }
      return newToken;
    } catch (err) {
      return null;
    } finally {
      // clear in-flight promise after completion so future refreshes can run
      setTimeout(() => { refreshPromise = null; }, 0);
    }
  })();

  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    if (!originalRequest) return Promise.reject(error);
    if (originalRequest._retry) return Promise.reject(error);

    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        setAccessToken(newToken);
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      }
      setAccessToken(null);
    }

    return Promise.reject(error);
  }
);
export default api;
// No client-side refresh token stored (server uses HttpOnly cookie). Keep stub for compatibility.
function getRefreshTokenFromStorageOrCookie(): any {
  return null;
}
