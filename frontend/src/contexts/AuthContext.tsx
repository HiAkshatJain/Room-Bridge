import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse, LoginData, SignupData } from '../types';
import ApiService from '../services/api';
import { setAccessToken, clearAuth } from '../utils/authStore';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  singupadmin: (data: SignupData) => Promise<void>;

  logout: () => void;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
 
      try {
        const response = await ApiService.refresh();
        const authData: AuthResponse = response.data;
        if (authData.accessToken) {
          setAccessToken(authData.accessToken);
        }

        const userData: User = {
          id: authData.id,
          email: '',
          name: '',
          roles: authData.roles || [],
        };
        setUser(userData);
        setUser(userData);
      } catch (err) {

      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    init();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await ApiService.login(data);
      const authData: AuthResponse = response.data;


      if (authData.accessToken) setAccessToken(authData.accessToken);

      const userData: User = {
        id: authData.id,
        email: data.email,
        name: '',
        roles: authData.roles || [],
      };

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
  const singupadmin = async (data: SignupData) => {
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
      const response = await ApiService.verifyOtp({ email, otp });
      const data = response?.data;
     
      if (typeof data === 'string' && /invalid|expired/i.test(data)) {
        toast.error(data);
        throw new Error(data);
      }
      toast.success(typeof data === 'string' ? data : 'Email verified successfully!');
    } catch (error: any) {
      const msg = error?.response?.data || error?.message || 'OTP verification failed';
      toast.error(msg);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await ApiService.forgotPassword(email);
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Request failed');
      throw error;
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      const response = await ApiService.resetPassword(email, otp, newPassword);
      const data = response?.data;
    
      if (typeof data === 'string' && /invalid|expired/i.test(data)) {
        toast.error(data);
        throw new Error(data);
      }
      toast.success('Password reset successful');
    } catch (error: any) {
      const msg = error?.response?.data || error?.message || 'Reset failed';
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    clearAuth();

    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
  isInitialized,
      login,
      signup,
      singupadmin,
      logout,
      verifyOtp,
  forgotPassword,
  resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};