import { api } from './client';

export interface AdminDashboardData {
  kpis: {
    total_users: number;
    active_users: number;
    admin_count: number;
    total_predictions: number;
    ai_model_requests: number;
    disease_detections: number;
    crop_recommendations: number;
    avg_prediction_confidence: number;
    system_health: {
      status: string;
      uptime: string;
      api_latency_ms: number;
      gpu_utilization_pct: number;
    };
  };
  charts: {
    user_growth: Array<{ month: string; users: number }>;
    daily_predictions: Array<{ day: string; count: number }>;
    prediction_types: Array<{ name: string; value: number; color: string }>;
    ai_model_usage: Array<{ model: string; requests: number; accuracy: number }>;
  };
}

export interface AdminUserItem {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  authentication_provider: string;
  status: string;
  is_active: boolean;
  profile_image: string;
  created_at: string;
  last_login: string;
}

export interface AdminModelItem {
  id: string;
  name: string;
  type: string;
  algorithm: string;
  version: string;
  status: string;
  accuracy: number;
  latency_ms: number;
  last_updated: string;
  api_status: string;
  supported_crops: number;
}

export interface AdminDatasetItem {
  id: string;
  name: string;
  domain: string;
  records: string;
  version: string;
  size_mb: number;
  status: string;
  last_updated: string;
}

export interface AdminPredictionItem {
  id: string;
  user: string;
  prediction_type: string;
  input: string;
  result: string;
  confidence: number;
  model: string;
  timestamp: string;
  status: string;
}

export interface AdminAuditLogItem {
  id: number;
  actor: string;
  role: string;
  action: string;
  target: string;
  details?: Record<string, unknown>;
  ip_address: string;
  timestamp: string;
}

export const adminService = {
  getDashboard: async (): Promise<AdminDashboardData> => {
    return api.get<AdminDashboardData>('/api/v1/admin/dashboard');
  },

  getUsers: async (params?: { page?: number; role?: string; search?: string }): Promise<{ users: AdminUserItem[]; total: number }> => {
    const q = new URLSearchParams();
    if (params?.page) q.append('page', params.page.toString());
    if (params?.role) q.append('role', params.role);
    if (params?.search) q.append('search', params.search);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return api.get<{ users: AdminUserItem[]; total: number }>(`/api/v1/admin/users${qs}`);
  },

  updateUserRole: async (userId: number, role: 'USER' | 'ADMIN', reason?: string): Promise<{ status: string; message: string }> => {
    return api.patch(`/api/v1/admin/users/${userId}/role`, { role, reason });
  },

  toggleUserStatus: async (userId: number, isActive: boolean, reason?: string): Promise<{ status: string; message: string }> => {
    return api.patch(`/api/v1/admin/users/${userId}/status`, { is_active: isActive, reason });
  },

  getModels: async (): Promise<AdminModelItem[]> => {
    return api.get<AdminModelItem[]>('/api/v1/admin/models');
  },

  toggleModel: async (modelId: string): Promise<{ status: string; message: string }> => {
    return api.patch(`/api/v1/admin/models/${modelId}/toggle`, {});
  },

  testModel: async (modelId: string): Promise<Record<string, unknown>> => {
    return api.post(`/api/v1/admin/models/${modelId}/test`, {});
  },

  getDatasets: async (): Promise<AdminDatasetItem[]> => {
    return api.get<AdminDatasetItem[]>('/api/v1/admin/datasets');
  },

  validateDatasets: async (): Promise<Record<string, unknown>> => {
    return api.post('/api/v1/admin/datasets/validate', {});
  },

  getPredictions: async (): Promise<{ predictions: AdminPredictionItem[]; total: number }> => {
    return api.get<{ predictions: AdminPredictionItem[]; total: number }>('/api/v1/admin/predictions');
  },

  getAuditLogs: async (): Promise<{ logs: AdminAuditLogItem[]; total: number }> => {
    return api.get<{ logs: AdminAuditLogItem[]; total: number }>('/api/v1/admin/logs');
  },
};
