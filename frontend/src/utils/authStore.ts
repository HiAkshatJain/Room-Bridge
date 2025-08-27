import { User } from '../types';

let accessToken: string | null = null;
let currentUser: User | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

export const setUser = (u: User | null) => {
  currentUser = u;
};

export const getUser = (): User | null => currentUser;

export const clearAuth = () => {
  accessToken = null;
  currentUser = null;
};

export default {
  setAccessToken,
  getAccessToken,
  setUser,
  getUser,
  clearAuth,
};
