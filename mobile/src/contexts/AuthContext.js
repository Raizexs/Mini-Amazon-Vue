import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  auth,
  GoogleAuthProvider,
  signInWithCredential,
  firebaseSignOut,
} from "../config/firebase";
import { authAPI } from "../services/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState(null);

  useEffect(() => {
    configureGoogleSignIn();
    loadUserFromStorage();
  }, []);

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: "REMOVED-rifo0o74n42e8iv787p6m3fh251jv7et.apps.googleusercontent.com", // Web Client ID
      offlineAccess: true,
    });
  };

  const loadUserFromStorage = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt_token");
      const userData = await AsyncStorage.getItem("user_data");

      if (token && userData) {
        setJwtToken(token);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("Google Sign-In Response:", JSON.stringify(userInfo, null, 2));
      
      // Check where the idToken is
      const idToken = userInfo.idToken || userInfo.data?.idToken;
      console.log("Extracted ID Token:", idToken ? "Token exists" : "Token is missing");

      if (!idToken) {
        throw new Error("No ID token found in Google Sign-In response");
      }

      // Sign in to Firebase with Google credential
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);

      // Get Firebase ID token
      const firebaseToken = await userCredential.user.getIdToken();

      // Exchange Firebase token for backend JWT
      const response = await authAPI.loginWithFirebase(firebaseToken);

      // Store JWT and user data
      await AsyncStorage.setItem("jwt_token", response.access_token);
      await AsyncStorage.setItem("user_data", JSON.stringify(response.user));

      setJwtToken(response.access_token);
      setUser(response.user);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign in is in progress already");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services not available or outdated");
      } else {
        console.error("Error signing in with Google:", error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);

      // Sign out from Google
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        console.error("Error signing out from Google:", e);
      }

      // Sign out from Firebase
      await firebaseSignOut(auth);

      // Clear local storage
      await AsyncStorage.removeItem("jwt_token");
      await AsyncStorage.removeItem("user_data");

      setUser(null);
      setJwtToken(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (fullName) => {
    try {
      const updatedUser = await authAPI.updateProfile(fullName);
      await AsyncStorage.setItem("user_data", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        jwtToken,
        loading,
        signInWithGoogle,
        signOut,
        updateUserProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
