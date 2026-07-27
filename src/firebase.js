import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Supports Vercel / Vite environment variables with fallback to project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCdZQq9kBwQ-k4GgJkxLtlRYWDn93BLmWc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kiranastore-50caa.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kiranastore-50caa",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kiranastore-50caa.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "938465026733",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:938465026733:web:e5341389c4d5995ccb1c24",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-01VYZMYF84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn("Firebase Analytics not supported in this environment:", err);
    });
}

export default app;
