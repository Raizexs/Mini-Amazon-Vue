// Firebase configuration
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "REMOVED",
  authDomain: "REMOVED",
  projectId: "REMOVED",
  storageBucket: "REMOVED.firebasestorage.app",
  messagingSenderId: "REMOVED",
  appId: "1:REMOVED:web:4655148a42aaecdc34c147",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, GoogleAuthProvider, signInWithCredential, firebaseSignOut };
export default app;
