import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';

// Centrally configured via .env by the administrator
export function getFirebaseConfig() {
  if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
  }
  return null;
}

let app = null;
let auth = null;
let db = null;

export function initFirebase() {
  const config = getFirebaseConfig();
  if (!config) {
    console.warn('Firebase is not configured. Please ensure VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID are set in .env');
    return { app: null, auth: null, db: null, isConfigured: false };
  }

  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }

    auth = getAuth(app);
    // Ensure auth session persists in local storage across browser tabs & app restarts
    setPersistence(auth, browserLocalPersistence).catch(() => {});

    // Modern multi-tab persistent offline cache
    try {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    } catch {
      // Fallback if already initialized
      db = getFirestore(app);
    }

    return { app, auth, db, isConfigured: true };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return { app: null, auth: null, db: null, isConfigured: false, error };
  }
}

// Initial attempt
const initial = initFirebase();
app = initial.app;
auth = initial.auth;
db = initial.db;

export { app, auth, db };

export async function loginWithEmail(email, password) {
  if (!auth) throw new Error('Firebase is not configured yet. Please check your .env configuration.');
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email, password) {
  if (!auth) throw new Error('Firebase is not configured yet. Please check your .env configuration.');
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  if (!auth) throw new Error('Firebase is not configured yet. Please check your .env configuration.');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return await signInWithPopup(auth, provider);
}

export async function logoutUser() {
  if (auth) {
    return await signOut(auth);
  }
}

export function subscribeToAuth(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
