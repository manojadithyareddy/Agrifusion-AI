import { api } from './client';
import type { User } from '../types/auth';

export interface UserDashboardStats {
  welcome_name: string;
  role: string;
  stats: {
    total_predictions: number;
    crop_recommendations: number;
    disease_detections: number;
    avg_prediction_confidence: number;
  };
  quick_actions: Array<{
    id: string;
    title: string;
    icon: string;
    desc: string;
    route: string;
  }>;
  recent_predictions: Array<{
    id: string;
    type: string;
    crop: string;
    result: string;
    confidence: number;
    remedy: string;
    date: string;
    status: string;
    status_color: string;
  }>;
}

export const userService = {
  getProfile: async (): Promise<User> => {
    return api.get<User>('/api/v1/user/profile');
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    return api.put<User>('/api/v1/user/profile', updates);
  },

  getDashboardStats: async (): Promise<UserDashboardStats> => {
    return api.get<UserDashboardStats>('/api/v1/user/dashboard-stats');
  },

  getPredictions: async (): Promise<Array<{ id: string; type: string; title: string; confidence: number; date: string; summary: string }>> => {
    return api.get('/api/v1/user/predictions');
  },

  getHistory: async (): Promise<Array<{ timestamp: string; event: string; detail: string }>> => {
    return api.get('/api/v1/user/history');
  },
};
