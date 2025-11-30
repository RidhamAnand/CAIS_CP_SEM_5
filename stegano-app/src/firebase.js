// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace with your Firebase project configuration
// Get this from Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyAGu1YnW5Yi89uhENUVt6oTmEk7c0g49jo",
  authDomain: "stegano-app.firebaseapp.com",
  projectId: "stegano-app",
  storageBucket: "stegano-app.firebasestorage.app",
  messagingSenderId: "873206684481",
  appId: "1:873206684481:web:f0d87b90c65513e9fb1fc0",
  measurementId: "G-4CR28CPG0T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export default app;
