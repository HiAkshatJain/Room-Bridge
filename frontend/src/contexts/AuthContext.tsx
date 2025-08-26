import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import axios from "axios";
import { User, AuthState } from "@/types";
import { useNavigate } from "react-router-dom";
import { setAccessToken, clearAccessToken } from "@/components/apis/api";
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8081";
interface AuthContextType extends AuthState {
  isUpdatingProfile: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (
    email: string,
    otp: string,
    password: string
  ) => Promise<boolean>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, SetToken] = useState<string | undefined>(undefined);
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    loading: true,
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const restore = async () => {
      let clientLoggedOut = false;
      try {
        clientLoggedOut = localStorage.getItem("clientLoggedOut") === "true";
      } catch (e) {
        clientLoggedOut = false;
      }
      if (clientLoggedOut) {
        SetToken(undefined);
        clearAccessToken();
        setAuthState({ isAuthenticated: false, loading: false });
        return;
      }
      try {
        const res = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const accessToken = res?.data?.accessToken;
        if (accessToken) {
          SetToken(accessToken);
          setAccessToken(accessToken);
          try {
            localStorage.removeItem("clientLoggedOut");
          } catch (e) {}
          setAuthState({ isAuthenticated: true, loading: false });
          return;
        }
      } catch (err) {}
      SetToken(undefined);
      clearAccessToken();
      setAuthState({ isAuthenticated: false, loading: false });
    };
    restore();
  }, []);
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "clientLoggedOut" && e.newValue === "true") {
        SetToken(undefined);
        clearAccessToken();
        setAuthState({ isAuthenticated: false, loading: false });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  useEffect(() => {
    if (token) setAccessToken(token);
    else clearAccessToken();
  }, [token]);
  useLayoutEffect(() => {
    return () => {
      clearAccessToken();
    };
  }, []);
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      const accessToken = response?.data?.accessToken;
      if (accessToken) {
        SetToken(accessToken);
        setAccessToken(accessToken);
        try {
          localStorage.removeItem("clientLoggedOut");
        } catch (e) {}
        setAuthState({ isAuthenticated: true, loading: false });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };
  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password,
        roles: ["USER"],
      });
      return true;
    } catch (error) {
      console.error("Signup failed", error);
      return false;
    }
  };
  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      const url = window.location.pathname.includes("forgot-password")
        ? `${API_URL}/verify-otp/forgot-password`
        : `${API_URL}/verify-otp`;
      await axios.post(url, { email, otp });
      return true;
    } catch (error) {
      console.error("OTP verification failed", error);
      return false;
    }
  };
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return true;
    } catch (error) {
      console.error("Forgot password failed", error);
      return false;
    }
  };
  const resetPassword = async (
    email: string,
    otp: string,
    password: string
  ): Promise<boolean> => {
    try {
      await axios.post(`${API_URL}/auth/verify-otp/password`, {
        email,
        otp,
        newPassword: password,
      });
      return true;
    } catch (error) {
      console.error("Reset password failed", error);
      return false;
    }
  };
  const logout = () => {
    try {
      localStorage.setItem("clientLoggedOut", "true");
    } catch (e) {}
    SetToken(undefined);
    clearAccessToken();
    setAuthState({ isAuthenticated: false, loading: false });
    navigate("/auth/login");
  };
  const updateProfile = async (data: Partial<User>) => {
    console.log("Updating profile with", data);
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};