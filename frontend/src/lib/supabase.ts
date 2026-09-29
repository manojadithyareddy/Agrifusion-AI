// ─────────────────────────────────────────────────────────────
//  AgriFusion AI – Supabase Configuration & Client Initialization
// ─────────────────────────────────────────────────────────────
import { createClient, type SupabaseClient, type User as SupabaseUser } from '@supabase/supabase-js';

// ── Supabase credentials — loaded from environment variables with safe defaults ──
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  'https://xenrnczedenmvljzlbin.supabase.co';

const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_KEY ||
  import.meta.env.SUPABASE_KEY ||
  'sb_publishable_BkmeBl1mAwJl6uQDOctAPw_gtrQwkC-';

// ── Initialize Supabase Client with graceful fallback ──
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ── Provider Configuration & Settings Diagnostics ──
export interface SupabaseAuthProvidersConfig {
  email: boolean;
  google: boolean;
  mailerAutoconfirm: boolean;
}

let cachedProvidersConfig: SupabaseAuthProvidersConfig | null = null;

export async function getAuthProvidersConfig(): Promise<SupabaseAuthProvidersConfig> {
  if (cachedProvidersConfig) return cachedProvidersConfig;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: {
        apikey: SUPABASE_KEY,
      },
    });
    if (res.ok) {
      const data = await res.json();
      cachedProvidersConfig = {
        email: Boolean(data?.external?.email ?? true),
        google: Boolean(data?.external?.google ?? false),
        mailerAutoconfirm: Boolean(data?.mailer_autoconfirm ?? false),
      };
      return cachedProvidersConfig;
    }
  } catch (err) {
    console.warn('[AgriFusion] Could not query Supabase auth settings:', err);
  }
  // Safe defaults based on current Supabase project diagnostics
  return {
    email: true,
    google: false,
    mailerAutoconfirm: false,
  };
}

export function formatSupabaseError(error: any): string {
  if (!error) return 'An unexpected authentication error occurred.';
  const msg = typeof error === 'string' ? error : error.message || error.msg || '';
  const code = (error.code || error.error_code || '').toString().toLowerCase();
  const lowerMsg = msg.toLowerCase();

  // Unsupported provider / provider disabled
  if (
    code === 'validation_failed' ||
    lowerMsg.includes('unsupported provider') ||
    lowerMsg.includes('provider is not enabled')
  ) {
    return 'Google OAuth is currently disabled in your Supabase project settings. Please sign in with Email & Password, or enable the Google provider in Supabase Dashboard → Authentication → Providers.';
  }

  // Email not confirmed
  if (code === 'email_not_confirmed' || lowerMsg.includes('email not confirmed')) {
    return 'Your email address has not been confirmed yet. A verification email was sent to your inbox upon registration. Please click the link to confirm your account before signing in.';
  }

  // Invalid login credentials
  if (
    code === 'invalid_credentials' ||
    lowerMsg.includes('invalid login credentials') ||
    lowerMsg.includes('invalid grant')
  ) {
    return 'Incorrect email or password. Please verify your credentials or register a new account.';
  }

  // User not found
  if (code === 'user_not_found' || lowerMsg.includes('user not found')) {
    return 'No account was found with this email address. Please check your spelling or register a new account.';
  }

  // User already exists
  if (
    code === 'user_already_exists' ||
    lowerMsg.includes('user already registered') ||
    lowerMsg.includes('already exists')
  ) {
    return 'An account with this email already exists. Please sign in or reset your password.';
  }

  // Weak password
  if (lowerMsg.includes('password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }

  // Network error
  if (lowerMsg.includes('fetch') || lowerMsg.includes('networkerror')) {
    return 'Unable to reach the authentication service. Please check your internet connection.';
  }

  return msg || 'Authentication request failed. Please check your credentials.';
}

// ─────────────────────────────────────────────────────────────
//  Helper Authentication Functions
// ─────────────────────────────────────────────────────────────

/**
 * Sign in with Google using Supabase OAuth.
 * Validates whether Google provider is enabled before attempting redirect.
 */
export async function signInWithGoogle(): Promise<{ user?: SupabaseUser | null }> {
  const config = await getAuthProvidersConfig();
  if (!config.google) {
    throw new Error(
      'Google OAuth is not currently enabled in the Supabase authentication dashboard. Please sign in with Email & Password, or configure Google credentials in Supabase Dashboard → Authentication → Providers.'
    );
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw new Error(formatSupabaseError(error));
  }

  // Get current user if available in session
  const { data: sessionData } = await supabase.auth.getSession();
  return { user: sessionData.session?.user || null };
}

/**
 * Sign in with email and password via Supabase Auth
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(formatSupabaseError(error));
  }

  return { session: data.session, user: data.user };
}

/**
 * Register a new user with email and password via Supabase Auth
 */
export async function registerWithEmail(
  email: string,
  password: string,
  userData?: { name?: string; role?: string; phone?: string }
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: userData
      ? {
          data: {
            full_name: userData.name,
            role: userData.role || 'USER',
            phone: userData.phone,
          },
        }
      : undefined,
  });

  if (error) {
    throw new Error(formatSupabaseError(error));
  }

  const requiresEmailVerification = Boolean(data.user && !data.session);

  return {
    session: data.session,
    user: data.user,
    requiresEmailVerification,
  };
}

/**
 * Send password reset email via Supabase Auth
 */
export async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw new Error(formatSupabaseError(error));
  }
}

/**
 * Update authenticated user's password in Supabase
 */
export async function updateUserPassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }

  return data.user;
}

/**
 * Sign out from Supabase Auth
 */
export async function supabaseSignOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.warn('[AgriFusion] Supabase sign out warning:', error.message);
  }
}

export type { SupabaseUser };
export default supabase;
