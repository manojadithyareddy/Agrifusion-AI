# AgriFusion AI — Supabase Architecture & Integration Guide

```
AgriFusion AI
      │
      ├── Google Sign-In
      ├── Email/Password
      │
      ▼
   Supabase Auth
      │
      ├── PostgreSQL
      ├── User Profiles
      ├── Storage
      └── Row-Level Security
```

This guide details the complete enterprise architecture connecting **AgriFusion AI** to **Supabase Auth, PostgreSQL, Storage, and Row-Level Security (RLS)**.

---

## 1. Architectural Overview

| Component | Responsibility in AgriFusion AI | Implementation in Codebase |
| :--- | :--- | :--- |
| **Google Sign-In** | One-tap OAuth 2.0 authentication for farmers & agronomists | `signInWithGoogle()` in `frontend/src/lib/supabase.ts` via Supabase OAuth redirect |
| **Email/Password** | Standard user registration, login, and password reset | `signInWithEmail()`, `registerWithEmail()`, `sendPasswordReset()`, `updateUserPassword()` |
| **Supabase Auth** | Central authentication engine issuing signed JWT tokens | Managed via `@supabase/supabase-js` client & validated in FastAPI backend |
| **PostgreSQL** | Relational data persistence for agricultural entities | Core tables: `profiles`, `farms`, `crop_scans`, `predictions`, `ai_conversations` |
| **User Profiles** | Synchronization between Supabase Auth identity and application profile | `public.profiles` populated automatically via `on_auth_user_created` trigger |
| **Storage** | Cloud object storage for avatars and crop disease leaf scans | Buckets: `avatars` (public read), `crop-scans` (auth write), `farm-documents` (private) |
| **Row-Level Security** | Tenant data isolation ensuring farmers only access their own records | Granular RLS policies enforced on all tables and `storage.objects` |

---

## 2. Supabase SQL Schema & Automated Migration

The production-grade SQL script is located in:
- [`supabase_schema.sql`](file:///c:/Users/madit/OneDrive/Desktop/production%20Level%20coding/supabase_schema.sql)
- [`supabase/migrations/20260925000000_agrifusion_core_schema.sql`](file:///c:/Users/madit/OneDrive/Desktop/production%20Level%20coding/supabase/migrations/20260925000000_agrifusion_core_schema.sql)

### How to apply in Supabase:
1. Open your **Supabase Dashboard** -> Select your Project.
2. Go to the **SQL Editor** on the left menu.
3. Paste the contents of `supabase_schema.sql` and click **Run**.

---

## 3. Database Schema Breakdown

### 3.1 `public.profiles`
Stores extended user profile attributes linked directly to `auth.users`:
- `id` (UUID, Primary Key, references `auth.users(id) ON DELETE CASCADE`)
- `email` (TEXT, user email)
- `full_name` & `name` (TEXT, farmer's name)
- `phone` (TEXT, mobile phone)
- `avatar_url` (TEXT, URL to Supabase Storage avatar)
- `role` (TEXT, `'USER'` or `'ADMIN'`)
- `preferred_language` (TEXT, default `'en'`, supports regional Indian languages: hi, te, ta, kn, mr, pa, gu)
- `state_id`, `district_id` (INTEGER, regional agricultural IDs)
- `is_active` (BOOLEAN, default `true`)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### 3.2 Automated Profile Synchronization Trigger
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, full_name, name, phone, avatar_url, role, preferred_language
  ) VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', 'https://api.dicebear.com/7.x/initials/svg?seed=' || encode(digest(new.email, 'sha1'), 'hex')),
    CASE WHEN LOWER(new.email) LIKE '%admin@agrifusion%' OR new.raw_user_meta_data->>'role' = 'ADMIN' THEN 'ADMIN' ELSE 'USER' END,
    COALESCE(new.raw_user_meta_data->>'preferred_language', 'en')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = now();
  RETURN new;
END;
$$;
```
Whenever a user logs in via **Google Sign-In** or signs up via **Email/Password**, Supabase triggers this function to guarantee an active row exists in `public.profiles`.

---

## 4. Supabase Storage Buckets & Policies

Three dedicated buckets are provisioned:

1. **`avatars`**:
   - **Access**: Public read (`public = true`).
   - **Upload**: Authenticated users can upload, update, and delete files inside their own user folder: `avatars/${auth.uid()}/*`.
   - **Size limit**: 5MB.
   - **MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`.

2. **`crop-scans`**:
   - **Access**: Public read for diagnosis reports, authenticated upload.
   - **Path**: `crop-scans/${auth.uid()}/*`.
   - **Size limit**: 10MB.
   - **MIME types**: `image/jpeg`, `image/png`, `image/webp`.

3. **`farm-documents`**:
   - **Access**: Private (`public = false`). Only the owner or system admin can view/download soil health and land records.
   - **Size limit**: 15MB.
   - **MIME types**: `image/*`, `application/pdf`, `application/json`.

---

## 5. Row-Level Security (RLS) Policies

All tables have RLS enabled:
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
```

### Security Rules:
- **Profiles**:
  - `SELECT`: `auth.uid() = id OR public.is_admin()`
  - `UPDATE`: `auth.uid() = id OR public.is_admin()`
- **Farms**:
  - `SELECT`: `auth.uid() = user_id OR public.is_admin()`
  - `INSERT`: `auth.uid() = user_id`
  - `UPDATE/DELETE`: `auth.uid() = user_id OR public.is_admin()`
- **Crop Scans & Predictions**:
  - `SELECT`: `auth.uid() = user_id OR public.is_admin()`
  - `INSERT`: `auth.uid() = user_id`
  - `DELETE`: `auth.uid() = user_id OR public.is_admin()`
- **AI Conversations**:
  - `SELECT`: `auth.uid() = user_id OR public.is_admin()`
  - `INSERT`: `auth.uid() = user_id`
  - `DELETE`: `auth.uid() = user_id OR public.is_admin()`

---

## 6. Frontend Integration Reference

1. **Google OAuth & Email Authentication**:
   - Implemented in [`frontend/src/lib/supabase.ts`](file:///c:/Users/madit/OneDrive/Desktop/production%20Level%20coding/frontend/src/lib/supabase.ts).
   - Coordinated in [`frontend/src/context/AuthContext.tsx`](file:///c:/Users/madit/OneDrive/Desktop/production%20Level%20coding/frontend/src/context/AuthContext.tsx).
   - Listens to `supabase.auth.onAuthStateChange` to capture OAuth redirects, load profile records, and store session tokens.

2. **Avatar Photo Upload to Supabase Storage**:
   - Implemented in [`frontend/src/pages/user/UserProfile.tsx`](file:///c:/Users/madit/OneDrive/Desktop/production%20Level%20coding/frontend/src/pages/user/UserProfile.tsx).
   - Directly calls `uploadUserAvatar(file)` which writes to the `avatars` bucket, updates the public URL in `public.profiles`, and updates application state.

3. **Crop Leaf Disease Image Cloud Storage**:
   - Implemented in [`frontend/src/pages/CropHealth.tsx`](file:///c:/Users/madit/OneDrive/Desktop/production%20Level%20coding/frontend/src/pages/CropHealth.tsx).
   - Uploads scanned leaf pictures to `crop-scans` bucket and persists diagnostic findings to `public.crop_scans`.

---

## 7. Backend FastAPI Validation Reference

1. Located in [`backend/app/auth/security.py`](file:///c:/Users/madit/OneDrive/Desktop/production%20Level%20coding/backend/app/auth/security.py) and [`backend/app/config.py`](file:///c:/Users/madit/OneDrive/Desktop/production%20Level%20coding/backend/app/config.py).
2. Supports Supabase JWT decoding:
   - Validates HMAC-SHA256 signature when `SUPABASE_JWT_SECRET` is set in environment variables.
   - Gracefully extracts claims (`sub`, `email`, `role`, `user_metadata`) for seamless API authentication across both native FastAPI endpoints and Supabase frontend calls.
