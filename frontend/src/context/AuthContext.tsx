import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  User,
  UserRole,
  LoginCredentials,
  RegisterCredentials,
  GoogleCredentials,
} from '../types/auth';
import { authService } from '../api/auth';
import { setStoredAuth, getStoredUser } from '../api/client';
import { signInWithGoogle as firebaseGoogleSignIn, firebaseSignOut } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ user: User; role: UserRole }>;
  register: (credentials: RegisterCredentials) => Promise<{ user: User; role: UserRole }>;
  loginWithGoogle: (credentials?: GoogleCredentials) => Promise<{ user: User; role: UserRole }>;
  demoLogin: (role: 'ADMIN' | 'USER') => Promise<{ user: User; role: UserRole }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser<User>());
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('agrifusion_token');
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const normalizeRole = (r?: string): UserRole => {
    if (!r) return 'USER';
    const up = r.toUpperCase();
    if (up === 'ADMIN') return 'ADMIN';
    return 'USER';
  };

  const handleAuthSuccess = (accessToken: string, authUser: User) => {
    const cleanUser = {
      ...authUser,
      role: normalizeRole(authUser.role),
      full_name: authUser.full_name || authUser.name,
    };
    setToken(accessToken);
    setUser(cleanUser);
    setStoredAuth(accessToken, cleanUser);
    return { user: cleanUser, role: cleanUser.role };
  };

  const refreshUser = useCallback(async (): Promise<User | null> => {
    const currentToken = localStorage.getItem('agrifusion_token');
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const freshProfile = await authService.getProfile();
      const cleanUser = {
        ...freshProfile,
        role: normalizeRole(freshProfile.role),
        full_name: freshProfile.full_name || freshProfile.name,
      };
      setUser(cleanUser);
      setStoredAuth(currentToken, cleanUser);
      return cleanUser;
    } catch (err) {
      console.warn('Could not refresh profile, token may be invalid:', err);
      // If error is unauthorized, clear
      setStoredAuth(null, null);
      setUser(null);
      setToken(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize and check token on app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('agrifusion_token');
      if (storedToken) {
        await refreshUser();
      } else {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for custom auth expired event from client.ts
    const onAuthExpired = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('agrifusion_auth_expired', onAuthExpired);
    return () => window.removeEventListener('agrifusion_auth_expired', onAuthExpired);
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      return handleAuthSuccess(response.access_token, response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.register(credentials);
      return handleAuthSuccess(response.access_token, response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (_googleCreds?: GoogleCredentials) => {
    setIsLoading(true);
    try {
      // 1. Trigger real Firebase Google Sign-In popup
      const { user: fbUser } = await firebaseGoogleSignIn();

      // 2. Send the Google user info to our backend to create/get session
      const payload: GoogleCredentials = {
        email: fbUser.email || '',
        name: fbUser.displayName || 'Google User',
        profile_image: fbUser.photoURL || undefined,
      };
      const response = await authService.googleAuth(payload);
      return handleAuthSuccess(response.access_token, response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (targetRole: 'ADMIN' | 'USER') => {
    setIsLoading(true);
    try {
      const creds: LoginCredentials =
        targetRole === 'ADMIN'
          ? { email: 'admin@agrifusion.ai', password: 'Admin@123' }
          : { email: 'farmer@agrifusion.ai', password: 'Farmer@123' };

      const response = await authService.login(creds);
      return handleAuthSuccess(response.access_token, response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      // Also sign out from Firebase
      await firebaseSignOut().catch(() => {});
    } catch {
      // Ignore
    } finally {
      setStoredAuth(null, null);
      setUser(null);
      setToken(null);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    const updated = await authService.updateProfile(updates);
    const cleanUser = {
      ...updated,
      role: normalizeRole(updated.role),
      full_name: updated.full_name || updated.name,
    };
    setUser(cleanUser);
    if (token) setStoredAuth(token, cleanUser);
    return cleanUser;
  };

  const currentRole: UserRole | null = user ? normalizeRole(user.role) : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        role: currentRole,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        demoLogin,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
