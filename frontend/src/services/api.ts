import axios, { AxiosInstance, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { getAccessToken, clearAuth, setAccessToken } from '../utils/authStore';

const API_BASE_URL = 'http://localhost:8081';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
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
                `${API_BASE_URL}/auth/refresh`,
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

  async signup(data: any) {
    return this.api.post('/auth/signup', data);
  }

  async verifyOtp(data: any) {
    if (window.location.hostname === 'localhost') {
      try {
        console.debug('[ApiService] verifyOtp payload:', data);
      } catch (e) {}
    }
    const resp = await this.api.post('/auth/verify-otp', data);
    if (window.location.hostname === 'localhost') {
      try {
        console.debug('[ApiService] verifyOtp response:', resp?.data);
      } catch (e) {}
    }
    return resp;
  }

  async login(data: any) {
    return this.api.post('/auth/login', data);
  }

 
  async refresh() {
    return this.api.post('/auth/refresh');
  }

  async forgotPassword(email: string) {
  const payload = { email };
  if (window.location.hostname === 'localhost') console.debug('[ApiService] forgotPassword payload:', payload);
  const resp = await this.api.post('/auth/forgot-password', payload);
  if (window.location.hostname === 'localhost') console.debug('[ApiService] forgotPassword response:', resp?.data);
  return resp;
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
  const payload = { email, otp, newPassword };
  if (window.location.hostname === 'localhost') console.debug('[ApiService] resetPassword payload:', payload);
  const resp = await this.api.post('/auth/verify-otp/password', payload);
  if (window.location.hostname === 'localhost') console.debug('[ApiService] resetPassword response:', resp?.data);
  return resp;
  }


  async createProfile(data: any) {
    return this.api.post('/profile/create', data);
  }

  async updateProfile(data: any) {
    return this.api.put('/profile/update', data);
  }

  async getProfile() {
    return this.api.get('/profile/me');
  }

  async uploadDocument(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getMyDocuments() {
    return this.api.get('/documents/my-documents');
  }

  async deleteDocument(id: number) {
    return this.api.delete(`/documents/my-documents/${id}`);
  }

  async verifyDocument(id: number, status: string) {
    return this.api.put(`/documents/${id}/verify`, { status });
  }

  async uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.api.post('/profile/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }



  async createRoom(data: any) {
    return this.api.post('/api/room', data);
  }

  async updateRoom(id: number, data: any) {
    return this.api.put(`/api/room/${id}`, data);
  }

  async getAllRooms() {
    return this.api.get('/api/room');
  }

  async getRandomRooms() {
    return this.api.get('/api/room/random?count=3')
  }

  async getChatUser() {
    return this.api.get('/api/chat/recent');
  }

  async getRoomById(id: number) {
    return this.api.get(`/api/room/${id}`);
  }

  async getMyRooms() {
    return this.api.get('/api/room/mine');
  }

  async updateRoomStatus(id: number, status: string) {
    return this.api.put(`/api/room/${id}/status`, { status });
  }

  async deleteRoom(id: number) {
    return this.api.delete(`/api/room/${id}`);
  }

  async uploadRoomImages(id: number, files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return this.api.put(`/api/room/${id}/upload-images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }


  async addReview(data: any) {
    return this.api.post('/api/room-reviews/add', data);
  }

  async getRoomReviews(roomId: number) {
    return this.api.get(`/api/room-reviews/room/${roomId}`);
  }


  async sendMessage(data: any) {
    return this.api.post('/api/chat/send', data);
  }

  async getConversation(senderId: number, receiverId: number) {
    return this.api.get(`/api/chat/conversation?senderId=${senderId}&receiverId=${receiverId}`);
  }

  async getAllUsers() {
    return this.api.get(`/admin/users`);
  }

  async getPendingDocuments() {
    return this.api.get(`/admin/documents`);
  }

  async deleteUsers(id:number) {
    return this.api.delete(`/admin/${id}`);
  }

  async deleteRoomById(id: number){
    return await this.api.delete(`/admin/room/${id}`);
  }

}

export default new ApiService();

