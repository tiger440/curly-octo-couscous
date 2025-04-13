// // import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_APP_MEASUREMENTID
    // apiKey: "AIzaSyBvEeWlsLUdWbJ137fuPdcPbDMDafz42Lc",
    // authDomain: "hermes-a55d9.firebaseapp.com",
    // projectId: "hermes-a55d9",
    // storageBucket: "hermes-a55d9.appspot.com",
    // messagingSenderId: "451012418298",
    // appId: "1:451012418298:web:340fa1c39b16fc80930743"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);