import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  auth,
  GoogleAuthProvider,
  signInWithCredential,
  firebaseSignOut,
} from "../config/firebase";
import { authAPI } from "../services/api";
import { Platform } from "react-native";
import Constants from "expo-constants";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState(null);

  // Detecta si está en Expo Go
  const isExpoGo = Constants.appOwnership === "expo";

  // Configuración para Expo Go, web y APK
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "522400273734-rifo0o74n42e8iv787p6m3fh251jv7et.apps.googleusercontent.com",
    webClientId:
      "522400273734-rifo0o74n42e8iv787p6m3fh251jv7et.apps.googleusercontent.com",
    androidClientId:
      "522400273734-r4479huf7gti2anj45mi95libngeouo3.apps.googleusercontent.com",
  });

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  useEffect(() => {
    if (response) {
      console.log("[GOOGLE] Auth response:", response);
    }
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleAuth(authentication);
    } else if (response?.type === "error") {
      console.log("[GOOGLE] Error response:", response);
    }
  }, [response]);

  // Ya no se necesita configureGoogleSignIn

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
      const result = await promptAsync();
      console.log("[GOOGLE] promptAsync result:", result);
    } catch (error) {
      console.error("[GOOGLE] Error with Google Sign-In:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Maneja el resultado de la autenticación de Google
  const handleGoogleAuth = async (authentication) => {
    try {
      setLoading(true);
      console.log("[GOOGLE] handleGoogleAuth authentication:", authentication);
      if (!authentication?.idToken) {
        throw new Error("No ID token found in Google Auth response");
      }
      // Sign in to Firebase with Google credential
      const credential = GoogleAuthProvider.credential(authentication.idToken);
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
      console.error("Error handling Google Auth:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
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
