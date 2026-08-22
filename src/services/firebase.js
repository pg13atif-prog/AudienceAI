import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

/**
 * Firebase Configuration connected to Code-Blooded backend ("cinescope-app")
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBbZdfq2rYGjh2_98KlM9vBXHvDOzaBL8c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cinescope-app.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://cinescope-app-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cinescope-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cinescope-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "335969845291",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:335969845291:web:e7302e848ef978cf026a6e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JFGS8505YT"
};

// Initialize Firebase App
let app = null;
let db = null;
let firestore = null;
let rtdb = null;
let auth = null;
let analytics = null;
let isFirestoreAvailable = false;
let isFirebaseAvailable = false;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  firestore = getFirestore(app);
  db = firestore;
  rtdb = getDatabase(app);
  auth = getAuth(app);
  isFirestoreAvailable = true;
  isFirebaseAvailable = true;

  // Initialize Firebase Analytics if running in a supported browser environment
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {});
  }
} catch (err) {
  console.warn('Firebase initialization note (fallback active):', err.message);
  isFirestoreAvailable = false;
  isFirebaseAvailable = false;
}

export { 
  app, 
  db, 
  firestore, 
  rtdb, 
  auth, 
  analytics, 
  isFirestoreAvailable, 
  isFirebaseAvailable 
};

export default app;
