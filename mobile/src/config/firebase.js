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
  apiKey: "AIzaSyCfFBbLLewgM4_NxAjIOtBpV_QFukKBB-I",
  authDomain: "mini-dc919.firebaseapp.com",
  projectId: "mini-dc919",
  storageBucket: "mini-dc919.firebasestorage.app",
  messagingSenderId: "522400273734",
  appId: "1:522400273734:web:4655148a42aaecdc34c147",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, GoogleAuthProvider, signInWithCredential, firebaseSignOut };
export default app;
