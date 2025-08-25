export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinedAt: string;
  isOnline: boolean;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  memberCount: number;
  isPrivate: boolean;
  tags: string[];
  createdAt: string;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  roomId: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
}

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
}

export interface FormData {
  fullName: string;
  address: string;
  phoneNumber: string;
  bio: string;
  profileImageUrl: string;
  verificationStatus: boolean;
  socialLinks: string;
}