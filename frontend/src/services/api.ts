import axios, { AxiosInstance, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8081';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
          original._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
              });
              
              const { accessToken } = response.data;
              localStorage.setItem('accessToken', accessToken);
              
              return this.api(original);
            }
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async signup(data: any) {
    return this.api.post('/auth/signup', data);
  }

  async verifyOtp(data: any) {
    return this.api.post('/auth/verify-otp', data);
  }

  async login(data: any) {
    return this.api.post('/auth/login', data);
  }

  // Profile endpoints
  async createProfile(data: any) {
    return this.api.post('/profile/create', data);
  }

  async updateProfile(data: any) {
    return this.api.put('/profile/update', data);
  }

  async getProfile() {
    return this.api.get('/profile/me');
  }

  async uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return this.api.post('/profile/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  // Document endpoints
  async uploadDocument(file: File) {
    const formData = new FormData();
    formData.append('document', file);
    return this.api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
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

  // Room endpoints
  async createRoom(data: any) {
    return this.api.post('/api/room', data);
  }

  async updateRoom(id: number, data: any) {
    return this.api.put(`/api/room/${id}`, data);
  }

  async getAllRooms() {
    return this.api.get('/api/room');
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

  // Review endpoints
  async addReview(data: any) {
    return this.api.post('/api/room-reviews/add', data);
  }

  async getRoomReviews(roomId: number) {
    return this.api.get(`/api/room-reviews/room/${roomId}`);
  }

  // Chat endpoints
  async sendMessage(data: any) {
    return this.api.post('/api/chat/send', data);
  }

  async getConversation(senderId: number, receiverId: number) {
    return this.api.get(`/api/chat/conversation?senderId=${senderId}&receiverId=${receiverId}`);
  }
}

export default new ApiService();