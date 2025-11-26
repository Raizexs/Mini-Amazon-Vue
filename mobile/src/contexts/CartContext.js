import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext({});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [cart]);

  const loadCart = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@mini_amazon_cart');
      if (jsonValue != null) {
        setCart(JSON.parse(jsonValue));
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async () => {
    try {
      const jsonValue = JSON.stringify(cart);
      await AsyncStorage.setItem('@mini_amazon_cart', jsonValue);
    } catch (e) {
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCart(currentCart => {
      const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        const newCart = [...currentCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...currentCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart(currentCart => 
      currentCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    setCart([]);
    try {
      await AsyncStorage.removeItem('@mini_amazon_cart');
    } catch (e) {
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
