import axios, { AxiosInstance } from 'axios';
import { getAccessToken, clearAuth, setAccessToken } from '../utils/authStore';

const RANKING_API_BASE_URL = 'http://localhost:5000';

class RankingApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: RANKING_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
   
    this.api.interceptors.request.use(
      (config) => {
        const token = getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
           
            const originalUrl = original?.url || '';
            if (originalUrl.includes('/auth/refresh')) {
              
              clearAuth();
              return Promise.reject(error);
            }

            original._retry = true;

            try {
              
              const response = await axios.post(
                `${RANKING_API_BASE_URL}/auth/refresh`,
                {},
                { withCredentials: true }
              );

              const { accessToken } = response.data;
              
              if (accessToken) {
                
                setAccessToken(accessToken);
              }

              original.headers = original.headers || {};
              original.headers.Authorization = `Bearer ${accessToken}`;
              return this.api(original);
            } catch (refreshError) {
              
              clearAuth();
              return Promise.reject(refreshError);
            }
          }

        return Promise.reject(error);
      }
    );
  }

 
  async refresh() {
    return this.api.post('/auth/refresh');
  }

  async getRoomsQuery(query: string) {
    return this.api.get(`/rank?query=${query}`);
  }

  async invalidateCache() {
    return this.api.get('invalidate-all');
  }

}


export default new RankingApiService();