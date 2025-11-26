import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { auth, GoogleAuthProvider, signInWithCredential, firebaseSignOut } from "../config/firebase";
import { authAPI } from "../services/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener Web Client ID desde variables de entorno
  const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  useEffect(() => {
    configureGoogleSignIn();
    loadUserFromStorage();
  }, []);

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
    });
  };

  const loadUserFromStorage = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt_token");
      const userData = await AsyncStorage.getItem("user_data");

      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      await AsyncStorage.clear(); 
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      
      if (!idToken) {
        throw new Error("No se obtuvo ID Token de Google");
      }

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;
      const firebaseToken = await firebaseUser.getIdToken();
      
      const response = await authAPI.googleLogin({ idToken: firebaseToken });
      
      await AsyncStorage.setItem("jwt_token", response.access_token);
      await AsyncStorage.setItem("user_data", JSON.stringify(response.user));
      
      setUser(response.user);
      
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // Usuario canceló
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // En progreso
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert("Google Play Services no está disponible o está desactualizado.");
      } else {
        let errorMessage = "Error al iniciar sesión con Google";
        
        if (error.response) {
          errorMessage = `Error del servidor: ${error.response.data?.detail || error.response.status}`;
        } else if (error.request) {
          errorMessage = "No se pudo conectar al servidor.";
        } else {
          errorMessage = `Error desconocido: ${error.message}`;
        }
        
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await firebaseSignOut(auth);
      await AsyncStorage.removeItem("jwt_token");
      await AsyncStorage.removeItem("user_data");
      setUser(null);
    } catch (error) {
      // Error silencioso
    }
  };

  const updateUserProfile = async (name) => {
    try {
      const updatedUser = { ...user, name };
      await AsyncStorage.setItem("user_data", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      // Error silencioso
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, updateUserProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;