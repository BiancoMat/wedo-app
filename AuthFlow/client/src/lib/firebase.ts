import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add Firestore import when ready to implement real-time data storage
// import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB0D8fG3x...",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "wedo-91064.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "wedo-91064",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "wedo-91064.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "XXXXXX",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:XXXX:web:XXXX"
};

// Initialize Firebase app only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// TODO: Export Firestore instance when ready for real-time data storage
// export const db = getFirestore(app);

export default app;
