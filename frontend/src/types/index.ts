export interface User {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

export interface AuthResponse {
  id: number;
  accessToken: string;
  refreshToken: string;
  roles: string[];
}

export interface Profile {
  id?: number;
  userId?: number;
  fullName: string;
  phoneNumber: string;
  address: string;
  bio: string;
  profileImageUrl?: string;
  verificationStatus: boolean;
  socialLinks?: string;
  createdAt?: string;
}

export interface Room {
  id?: number;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrls: string[];
  furnished: boolean;
  roomType: 'PRIVATE' | 'SHARED';
  status?: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
  availableFrom: string;
  genderPreference: 'MALE' | 'FEMALE' | 'ANY';
  maxOccupancy: number;
  isAvailable: boolean;
  userId?: number;
  available?: boolean;
}

export interface Document {
  id: number;
  documentName: string;
  documentPath: string;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Review {
  id?: number;
  roomId: number;
  userId: number;
  userName?: string;
  rating: number;
  reviewComment: string;
  createdAt?: string;
}

export interface ChatMessage {
  content: string;
  timestamp: string;
  senderId: number;
  receiverId: number;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  roles: string[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OTPData {
  email: string;
  otp: string;
}