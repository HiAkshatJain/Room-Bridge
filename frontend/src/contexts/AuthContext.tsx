import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse, LoginData, SignupData } from '../types';
import ApiService from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  verifyOtp: (email: string, otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    
    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await ApiService.login(data);
      const authData: AuthResponse = response.data;
      
      localStorage.setItem('accessToken', authData.accessToken);
      localStorage.setItem('refreshToken', authData.refreshToken);
      
      const userData: User = {
        id: authData.id,
        email: data.email,
        name: '', // Will be fetched from profile
        roles: authData.roles,
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      console.log(data)
      await ApiService.signup(data);
      toast.success('Registration successful! Please verify your email.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      await ApiService.verifyOtp({ email, otp });
      toast.success('Email verified successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      verifyOtp,
    }}>
      {children}
    </AuthContext.Provider>
  );
};