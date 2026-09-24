import { api } from './client';
import type {
  User,
  TokenResponse,
  LoginCredentials,
  RegisterCredentials,
  GoogleCredentials,
} from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    return api.post<TokenResponse>('/api/v1/auth/login', credentials);
  },

  register: async (credentials: RegisterCredentials): Promise<TokenResponse> => {
    return api.post<TokenResponse>('/api/v1/auth/register', credentials);
  },

  googleAuth: async (credentials: GoogleCredentials): Promise<TokenResponse> => {
    return api.post<TokenResponse>('/api/v1/auth/google', credentials);
  },

  getProfile: async (): Promise<User> => {
    return api.get<User>('/api/v1/auth/me');
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    return api.patch<User>('/api/v1/auth/me', updates);
  },

  forgotPassword: async (email: string): Promise<{ status: string; message: string; reset_token?: string }> => {
    return api.post('/api/v1/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string, confirmPassword?: string): Promise<{ status: string; message: string }> => {
    return api.post('/api/v1/auth/reset-password', {
      token,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/api/v1/auth/logout', {});
    } catch {
      // Ignore network errors on logout
    }
  },
};
