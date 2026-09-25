// ─────────────────────────────────────────────────────────────
//  AgriFusion AI – Supabase Configuration, Auth, Storage & Data
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

// ── Initialize Supabase Client with auto session refresh ──
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ── Storage Bucket Names ──
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  CROP_SCANS: 'crop-scans',
  FARM_DOCS: 'farm-documents',
} as const;

// ── Supabase Profile Interface ──
export interface SupabaseProfile {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  phone?: string;
  avatar_url?: string;
  role: 'USER' | 'ADMIN';
  preferred_language?: string;
  state_id?: number | null;
  district_id?: number | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────────────────────
//  1. Authentication Helpers (Google Sign-In & Email/Password)
// ─────────────────────────────────────────────────────────────

/**
 * Sign in with Google using Supabase OAuth.
 * Initiates standard Google authentication flow with automatic redirect.
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
            name: userData.name,
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

// ─────────────────────────────────────────────────────────────
//  2. User Profiles Operations (PostgreSQL `profiles` table)
// ─────────────────────────────────────────────────────────────

/**
 * Fetch user profile from Supabase PostgreSQL `profiles` table
 */
export async function getSupabaseProfile(userId: string): Promise<SupabaseProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[AgriFusion] Could not fetch profile from Supabase:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[AgriFusion] Profiles table query error:', err);
    return null;
  }
}

/**
 * Update or upsert user profile in Supabase PostgreSQL `profiles` table
 */
export async function updateSupabaseProfile(
  userId: string,
  updates: Partial<SupabaseProfile>
): Promise<SupabaseProfile | null> {
  try {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) {
      console.warn('[AgriFusion] Update profile warning:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[AgriFusion] Update profile error:', err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
//  3. Storage Operations (Avatars, Crop Scans, Farm Documents)
// ─────────────────────────────────────────────────────────────

/**
 * Helper to get public URL for a file in a Supabase Storage bucket
 */
export function getStoragePublicUrl(bucket: string, filePath: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data?.publicUrl || '';
}

/**
 * Upload a user avatar to the Supabase Storage `avatars` bucket.
 * Organizes files by userId folder: `${userId}/avatar-${timestamp}.${ext}`
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const filePath = `${userId}/avatar-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.AVATARS)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload avatar to Supabase: ${uploadError.message}`);
  }

  const publicUrl = getStoragePublicUrl(STORAGE_BUCKETS.AVATARS, filePath);

  // Sync with profiles table
  await updateSupabaseProfile(userId, { avatar_url: publicUrl });

  return publicUrl;
}

/**
 * Upload a crop disease leaf image to the Supabase Storage `crop-scans` bucket.
 */
export async function uploadCropScanImage(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const filePath = `${userId}/scan-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.CROP_SCANS)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload crop scan to Supabase: ${uploadError.message}`);
  }

  return getStoragePublicUrl(STORAGE_BUCKETS.CROP_SCANS, filePath);
}

// ─────────────────────────────────────────────────────────────
//  4. Agriculture Data Helpers (RLS Protected)
// ─────────────────────────────────────────────────────────────

export interface CropScanRecord {
  id?: string;
  user_id: string;
  crop_name: string;
  image_url?: string;
  health_status?: string;
  diagnosis_summary?: string;
  detections?: any;
  recommendations?: any;
  confidence?: number;
  created_at?: string;
}

/**
 * Save crop scan diagnosis to Supabase `crop_scans` table
 */
export async function saveCropScanToSupabase(record: CropScanRecord) {
  try {
    const { data, error } = await supabase
      .from('crop_scans')
      .insert([record])
      .select()
      .maybeSingle();

    if (error) {
      console.warn('[AgriFusion] Could not persist scan to Supabase:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[AgriFusion] Crop scan insert error:', err);
    return null;
  }
}

/**
 * Fetch authenticated user's crop scans from Supabase (enforces RLS)
 */
export async function getUserCropScans(userId: string) {
  try {
    const { data, error } = await supabase
      .from('crop_scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[AgriFusion] Fetch crop scans warning:', error.message);
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

/**
 * Save AI prediction record to Supabase `predictions` table
 */
export async function savePredictionToSupabase(prediction: {
  user_id: string;
  farm_id?: string;
  prediction_type: string;
  input_data: any;
  output_data: any;
  confidence?: number;
}) {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .insert([prediction])
      .select()
      .maybeSingle();

    if (error) {
      console.warn('[AgriFusion] Prediction save notice:', error.message);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export type { SupabaseUser };
export default supabase;
