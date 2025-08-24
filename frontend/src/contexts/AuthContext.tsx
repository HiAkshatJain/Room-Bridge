import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User, AuthState } from '@/types';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8081/auth';

interface AuthContextType extends AuthState {
  isUpdatingProfile: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, otp: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      setAuthState({
        isAuthenticated: true,
        user: JSON.parse(user),
        loading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { accessToken, refreshToken, ...user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await axios.post(`${API_URL}/signup`, { name, email, password, roles: ['USER'] });
      return true;
    } catch (error) {
      console.error('Signup failed', error);
      return false;
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      // Use a different endpoint for password reset OTP verification
      const url = window.location.pathname.includes('forgot-password')
        ? `${API_URL}/verify-otp/forgot-password`
        : `${API_URL}/verify-otp`;
      await axios.post(url, { email, otp });
      return true;
    } catch (error) {
      console.error('OTP verification failed', error);
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      return true;
    } catch (error) {
      console.error('Forgot password failed', error);
      return false;
    }
  };

  const resetPassword = async (email: string, otp: string, password: string): Promise<boolean> => {
    try {
      await axios.post(`${API_URL}/verify-otp/password`, { email, otp, newPassword: password });
      return true;
    } catch (error) {
      console.error('Reset password failed', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
    navigate('/auth/login');
  };

  const updateProfile = async (data: Partial<User>) => {
    // This needs a backend endpoint
    console.log('Updating profile with', data);
  };

  const value = {
    ...authState,
    isUpdatingProfile,
    login,
    signup,
    logout,
    updateProfile,
    verifyOtp,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};