// ─────────────────────────────────────────────────────────────
//  AgriFusion AI – Firebase Configuration & Initialization
// ─────────────────────────────────────────────────────────────
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';

// ── Firebase project config — loaded from environment variables ──
// Local dev: set these in frontend/.env.local (gitignored)
// Production: set these in Vercel Dashboard → Environment Variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ── Initialize Firebase app (avoid double-init in HMR) ──
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ── Auth ──
export const firebaseAuth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// ── Analytics (browser-only, degrades gracefully in SSR/Node) ──
export let firebaseAnalytics: ReturnType<typeof getAnalytics> | null = null;
isSupported().then((supported) => {
  if (supported) {
    firebaseAnalytics = getAnalytics(app);
  }
});

// ─────────────────────────────────────────────────────────────
//  Helper functions
// ─────────────────────────────────────────────────────────────

/** Sign in with Google popup – returns the Firebase IdToken string */
export async function signInWithGoogle(): Promise<{ idToken: string; user: FirebaseUser }> {
  const result = await signInWithPopup(firebaseAuth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
}

/** Sign in with email + password */
export async function signInWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  const idToken = await credential.user.getIdToken();
  return { idToken, user: credential.user };
}

/** Register a new user with email + password */
export async function registerWithEmail(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  const idToken = await credential.user.getIdToken();
  return { idToken, user: credential.user };
}

/** Send password reset email */
export async function sendFirebasePasswordReset(email: string) {
  await sendPasswordResetEmail(firebaseAuth, email);
}

/** Sign out from Firebase */
export async function firebaseSignOut() {
  await signOut(firebaseAuth);
}

/** Subscribe to Firebase auth state changes */
export { onAuthStateChanged };
export type { FirebaseUser };

export default app;
