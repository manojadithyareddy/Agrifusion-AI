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

// ─────────────────────────────────────────────────────────────
//  Helper Authentication Functions
// ─────────────────────────────────────────────────────────────

/**
 * Sign in with Google using Supabase OAuth.
 * Initiates standard Google authentication flow.
 */
export async function signInWithGoogle(): Promise<{ user?: SupabaseUser | null }> {
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
    throw error;
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
    throw error;
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
    throw error;
  }

  return { session: data.session, user: data.user };
}

/**
 * Send password reset email via Supabase Auth
 */
export async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw error;
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
