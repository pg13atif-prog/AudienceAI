import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

/**
 * Firebase Configuration for project "audienceai-1"
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCOzp10HxhLrhgIwMifmCNf-77tLxFe3KM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "audienceai-1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "audienceai-1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "audienceai-1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "390229689943",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:390229689943:web:97ff38c5e28a2436984512",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-G9C05F4SNB"
};

// Initialize Firebase App
let app = null;
let db = null;
let analytics = null;
let isFirestoreAvailable = false;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  isFirestoreAvailable = true;

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
}

export { app, db, analytics, isFirestoreAvailable };
