// ─────────────────────────────────────────────────────────────
//  AgriFusion AI – Firebase Configuration & Initialization
// ─────────────────────────────────────────────────────────────
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth';

// ── Firebase project config — loaded from environment variables with safe defaults ──
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDqsSeAI5itvo4CW2AGttbbum5ezOuAFn0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agritech-c8959.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agritech-c8959",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agritech-c8959.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "166983261220",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:166983261220:web:ba1525902ba15e5c968cb1",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-QC91FWDREC",
};

// ── Safe Initialize Firebase App & Auth ──
let app: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined') {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    firebaseAuth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
  }
} catch (err) {
  console.warn('[AgriFusion] Firebase initialization notice (running in safe mode):', err);
}

export { firebaseAuth, googleProvider };

// ── Analytics (browser-only, degrades gracefully) ──
export let firebaseAnalytics: Analytics | null = null;
if (app) {
  isSupported().then((supported) => {
    if (supported && app) {
      try {
        firebaseAnalytics = getAnalytics(app);
      } catch {
        // Analytics failure is non-fatal
      }
    }
  });
}

// ─────────────────────────────────────────────────────────────
//  Helper functions
// ─────────────────────────────────────────────────────────────

/** Sign in with Google popup – returns the Firebase IdToken string */
export async function signInWithGoogle(): Promise<{ idToken: string; user: FirebaseUser }> {
  if (!firebaseAuth || !googleProvider) {
    throw new Error('Firebase Auth is not available. Please verify your Firebase API key in environment variables.');
  }
  const result = await signInWithPopup(firebaseAuth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
}

/** Sign in with email + password */
export async function signInWithEmail(email: string, password: string) {
  if (!firebaseAuth) {
    throw new Error('Firebase Auth is not available. Please verify your Firebase API key in environment variables.');
  }
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  const idToken = await credential.user.getIdToken();
  return { idToken, user: credential.user };
}

/** Register a new user with email + password */
export async function registerWithEmail(email: string, password: string) {
  if (!firebaseAuth) {
    throw new Error('Firebase Auth is not available. Please verify your Firebase API key in environment variables.');
  }
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  const idToken = await credential.user.getIdToken();
  return { idToken, user: credential.user };
}

/** Send password reset email */
export async function sendFirebasePasswordReset(email: string) {
  if (!firebaseAuth) {
    throw new Error('Firebase Auth is not available.');
  }
  await sendPasswordResetEmail(firebaseAuth, email);
}

/** Sign out from Firebase */
export async function firebaseSignOut() {
  if (firebaseAuth) {
    await signOut(firebaseAuth);
  }
}

/** Subscribe to Firebase auth state changes */
export { onAuthStateChanged };
export type { FirebaseUser };

export default app;
