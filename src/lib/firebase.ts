import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// In a real scenario, this would be imported from firebase-applet-config.json
// or populated via environment variables.
const firebaseConfig = {
  apiKey: "TODO_REPLACE_WITH_YOUR_API_KEY",
  authDomain: "TODO_REPLACE_WITH_YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "TODO_REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "TODO_REPLACE_WITH_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "TODO_REPLACE_WITH_YOUR_SENDER_ID",
  appId: "TODO_REPLACE_WITH_YOUR_APP_ID"
};

const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey !== "TODO_REPLACE_WITH_YOUR_API_KEY";

let app;
try {
  if (isConfigValid) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  }
} catch (error) {
  console.warn("Firebase failed to initialize:", error);
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
