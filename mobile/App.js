import React, { useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { CartProvider } from "./src/contexts/CartContext";
import { FavoritesProvider } from "./src/contexts/FavoritesContext";
import { View, StyleSheet } from "react-native"; // Quitamos ActivityIndicator si mantenemos el Splash
import * as SplashScreen from 'expo-splash-screen';

// Mantenemos el Splash visible al inicio
SplashScreen.preventAutoHideAsync();

// Screens
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProductsScreen from "./src/screens/ProductsScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import CartScreen from "./src/screens/CartScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";

const Stack = createNativeStackNavigator();

function Navigation() {
  const { user, loading } = useAuth();

  // Esta función se ejecutará SOLO cuando la vista principal se haya renderizado
  const onLayoutRootView = useCallback(async () => {
    if (!loading) {
      // Solo ocultamos el splash cuando la carga terminó Y el componente se montó
      await SplashScreen.hideAsync();
    }
  }, [loading]);

  // Timeout de seguridad (Excelente idea mantenerlo por si la API falla)
  useEffect(() => {
    const timeout = setTimeout(async () => {
      // Solo intentamos ocultar si sigue visible, para evitar errores en consola
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        // Ya estaba oculto, no pasa nada
      }
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  // Mientras está cargando, mostramos el fondo oscuro (NO blanco)
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#09090b' }} onLayout={onLayoutRootView} />
    );
  }

  return (
    // AQUI es donde conectamos el onLayout.
    // Cuando este View se termine de "pintar", se dispara la función y se va el Splash.
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: '#9333EA',
            background: '#09090b',
            card: '#09090b',
            text: '#FAFAFA',
            border: 'rgba(255, 255, 255, 0.08)',
            notification: '#9333EA',
          },
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 200,
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: { backgroundColor: '#09090b' },
          }}
        >
          {!user ? (
            // Flujo No Autenticado
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            // Flujo Autenticado
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Products" component={ProductsScreen} />
              <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
              <Stack.Screen name="Cart" component={CartScreen} />
              <Stack.Screen name="Checkout" component={CheckoutScreen} />
              <Stack.Screen name="Orders" component={OrdersScreen} />
              <Stack.Screen name="Favorites" component={FavoritesScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <Navigation />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
