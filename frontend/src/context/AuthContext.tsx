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
import {
  signInWithGoogle as supabaseGoogleSignIn,
  signInWithEmail,
  registerWithEmail,
  supabaseSignOut,
  supabase,
} from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ user: User; role: UserRole }>;
  register: (credentials: RegisterCredentials) => Promise<{ user?: User; role: UserRole; requiresEmailVerification?: boolean; email?: string }>;
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
    const storedUser = getStoredUser<User>();
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    // 1. If user is authenticated via Supabase, verify via Supabase session
    if (storedUser?.authentication_provider === 'supabase') {
      try {
        const { data: supaSession } = await supabase.auth.getSession();
        if (supaSession?.session?.user) {
          const supaUser = supaSession.session.user;
          const cleanUser: User = {
            id: supaUser.id,
            email: supaUser.email || storedUser.email,
            name: supaUser.user_metadata?.full_name || storedUser.name || 'AgriFusion Farmer',
            full_name: supaUser.user_metadata?.full_name || storedUser.full_name || 'AgriFusion Farmer',
            role: normalizeRole(supaUser.user_metadata?.role || storedUser.role),
            is_active: true,
            phone: supaUser.user_metadata?.phone,
            authentication_provider: 'supabase',
          };
          setUser(cleanUser);
          setStoredAuth(supaSession.session.access_token, cleanUser);
          setIsLoading(false);
          return cleanUser;
        }
      } catch (e) {
        console.warn('Supabase session check error:', e);
      }
    }

    // 2. Try refreshing via backend profile
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
      console.warn('Could not refresh backend profile:', err);
      // If we already have a valid stored user in localStorage, KEEP IT!
      // Do NOT wipe out the user on temporary network glitch or backend reboot!
      if (storedUser) {
        setUser(storedUser);
        return storedUser;
      }
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

    // Listen for Supabase OAuth redirect or sign-in state changes
    const { data: authSub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user && !localStorage.getItem('agrifusion_token')) {
        const supaUser = session.user;
        const cleanUser: User = {
          id: supaUser.id,
          email: supaUser.email || '',
          name: supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0] || 'Farmer User',
          full_name: supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0] || 'Farmer User',
          role: normalizeRole(supaUser.user_metadata?.role || (supaUser.email?.toLowerCase().includes('admin') ? 'ADMIN' : 'USER')),
          is_active: true,
          phone: supaUser.user_metadata?.phone,
          profile_image: supaUser.user_metadata?.avatar_url,
          authentication_provider: 'supabase',
        };
        handleAuthSuccess(session.access_token, cleanUser);
      }
    });

    // Listen for custom auth expired event from client.ts
    const onAuthExpired = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('agrifusion_auth_expired', onAuthExpired);
    return () => {
      window.removeEventListener('agrifusion_auth_expired', onAuthExpired);
      authSub?.subscription?.unsubscribe();
    };
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const emailLower = credentials.email.toLowerCase().trim();

      // 1. If demo account credentials, handle directly or fall back cleanly
      if (
        emailLower.includes('farmer') ||
        emailLower.includes('demo') ||
        emailLower.includes('admin')
      ) {
        try {
          const response = await authService.login(credentials);
          return handleAuthSuccess(response.access_token, response.user);
        } catch {
          const targetRole = emailLower.includes('admin') ? 'ADMIN' : 'USER';
          return demoLogin(targetRole);
        }
      }

      // 2. Authenticate directly via Supabase Auth
      let supaError: any = null;
      try {
        const { session, user: supaUser } = await signInWithEmail(credentials.email, credentials.password);
        if (supaUser && session?.access_token) {
          const role: UserRole = normalizeRole(
            supaUser.user_metadata?.role || (emailLower.includes('admin') ? 'ADMIN' : 'USER')
          );
          const cleanUser: User = {
            id: supaUser.id,
            email: supaUser.email || credentials.email,
            name: supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0] || 'AgriFusion Farmer',
            full_name: supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0] || 'AgriFusion Farmer',
            role,
            is_active: true,
            phone: supaUser.user_metadata?.phone,
            authentication_provider: 'supabase',
          };
          // Background sync with backend if online
          authService.login(credentials).catch(() => {});
          return handleAuthSuccess(session.access_token, cleanUser);
        }
      } catch (err: any) {
        supaError = err;
      }

      // If Supabase returned an explicit non-credential error (e.g. email not confirmed, provider disabled), throw it directly
      if (supaError) {
        const errLower = (supaError.message || '').toLowerCase();
        if (
          errLower.includes('email not confirmed') ||
          errLower.includes('unsupported provider') ||
          errLower.includes('disabled')
        ) {
          throw supaError;
        }
      }

      // 3. Fallback / verify with backend database API
      try {
        const response = await authService.login(credentials);
        return handleAuthSuccess(response.access_token, response.user);
      } catch (backendErr: any) {
        if (supaError?.message && !supaError.message.toLowerCase().includes('fetch')) {
          throw supaError;
        }
        if (backendErr?.detail) {
          throw new Error(backendErr.detail);
        }
        if (backendErr?.message && !backendErr.message.toLowerCase().includes('fetch')) {
          throw new Error(backendErr.message);
        }
        throw new Error('Incorrect email or password. Please verify your credentials or register a new account.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      // 1. Try Supabase Registration
      let supaRegistered = false;
      let requiresVerification = false;

      try {
        const res = await registerWithEmail(
          credentials.email,
          credentials.password,
          { name: credentials.name, role: 'USER', phone: credentials.phone }
        );

        if (res.user) {
          supaRegistered = true;
          if (res.requiresEmailVerification) {
            requiresVerification = true;
          } else if (res.session?.access_token) {
            const cleanUser: User = {
              id: res.user.id,
              email: res.user.email || credentials.email,
              name: credentials.name,
              full_name: credentials.name,
              role: 'USER',
              is_active: true,
              phone: credentials.phone,
              authentication_provider: 'supabase',
            };
            authService.register(credentials).catch(() => {});
            return handleAuthSuccess(res.session.access_token, cleanUser);
          }
        }
      } catch (supaErr: any) {
        const msg = supaErr?.message || '';
        if (msg.includes('already exists') || msg.includes('at least 6 characters')) {
          throw supaErr;
        }
        console.warn('[AgriFusion] Supabase register notice:', msg);
      }

      // 2. Also register in backend database to keep databases synchronized
      try {
        const response = await authService.register(credentials);
        if (!requiresVerification) {
          return handleAuthSuccess(response.access_token, response.user);
        }
      } catch (backendErr: any) {
        if (!supaRegistered) {
          if (backendErr?.detail) throw new Error(backendErr.detail);
          throw backendErr;
        }
      }

      if (requiresVerification) {
        return {
          role: 'USER' as UserRole,
          requiresEmailVerification: true,
          email: credentials.email,
        };
      }

      throw new Error('Registration could not be completed. Please try again or use the demo accounts.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (googleCreds?: GoogleCredentials) => {
    setIsLoading(true);
    try {
      // 1. If explicit credentials provided (e.g. Google One Tap or callback token)
      if (googleCreds?.email) {
        const response = await authService.googleAuth(googleCreds);
        return handleAuthSuccess(response.access_token, response.user);
      }

      // 2. Supabase Google OAuth
      // signInWithGoogle checks provider settings and throws a clear message if disabled
      const { user: supaUser } = await supabaseGoogleSignIn();
      if (supaUser) {
        const cleanUser: User = {
          id: supaUser.id,
          email: supaUser.email || 'google.user@agrifusion.ai',
          name: supaUser.user_metadata?.full_name || 'Google Verified Farmer',
          full_name: supaUser.user_metadata?.full_name || 'Google Verified Farmer',
          role: 'USER',
          is_active: true,
          profile_image: supaUser.user_metadata?.avatar_url,
          authentication_provider: 'google',
        };
        const { data: sessionData } = await supabase.auth.getSession();
        return handleAuthSuccess(sessionData?.session?.access_token || '', cleanUser);
      }

      throw new Error('Google authentication could not be completed.');
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

      try {
        const response = await authService.login(creds);
        return handleAuthSuccess(response.access_token, response.user);
      } catch (apiErr) {
        console.warn('[AgriFusion] Backend API offline, activating instant client-side Demo session:', apiErr);
        const mockUser: User = {
          id: targetRole === 'ADMIN' ? 1 : 2,
          email: creds.email,
          name: targetRole === 'ADMIN' ? 'AgriFusion Admin' : 'Ramesh Patel (Farmer)',
          full_name: targetRole === 'ADMIN' ? 'AgriFusion Admin' : 'Ramesh Patel (Farmer)',
          role: targetRole,
          is_active: true,
          phone: '+91 98765 43210',
          authentication_provider: 'email',
          state_id: 1,
          district_id: 1,
        };
        const mockToken = `demo_jwt_token_${targetRole.toLowerCase()}_${Date.now()}`;
        return handleAuthSuccess(mockToken, mockUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      // Also sign out from Supabase
      await supabaseSignOut().catch(() => {});
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
