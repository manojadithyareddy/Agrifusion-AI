export type UserRole = 'USER' | 'ADMIN';

export type AuthProvider = 'email' | 'google' | 'supabase' | 'local';

export interface User {
  id: number | string;
  name: string;
  full_name?: string;
  email: string;
  phone?: string;
  profile_image?: string;
  authentication_provider: AuthProvider;
  role: UserRole;
  is_active: boolean;
  state_id?: number | null;
  district_id?: number | null;
  preferred_language?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirm_password?: string;
  phone?: string;
  terms_accepted: boolean;
}

export interface GoogleCredentials {
  credential?: string;
  email?: string;
  name?: string;
  profile_image?: string;
  google_id?: string;
}
