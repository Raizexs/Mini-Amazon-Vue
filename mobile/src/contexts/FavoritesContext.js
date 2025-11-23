import React, { createContext, useContext, useEffect, useState } from "react";
import { favoritesAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await favoritesAPI.getFavorites();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (product) => {
    // Optimistic update
    const isFav = isFavorite(product.id);
    
    if (isFav) {
      // Remove
      const favItem = favorites.find(f => f.product_id === product.id || f.product?.id === product.id);
      if (!favItem) return; // Should not happen if isFav is true

      // Optimistically remove from state
      setFavorites(prev => prev.filter(f => f.id !== favItem.id));

      try {
        await favoritesAPI.removeFavorite(product.id);
      } catch (error) {
        console.error("Error removing favorite:", error);
        // Revert on error
        setFavorites(prev => [...prev, favItem]);
      }
    } else {
      // Add
      // Create temp item for optimistic update
      const tempId = Date.now(); 
      const newFav = {
        id: tempId,
        product_id: product.id,
        product: product,
        created_at: new Date().toISOString()
      };

      // Optimistically add to state
      setFavorites(prev => [...prev, newFav]);

      try {
        const response = await favoritesAPI.addFavorite(product.id);
        // Replace temp item with real one from server
        setFavorites(prev => prev.map(f => f.id === tempId ? response : f));
      } catch (error) {
        console.error("Error adding favorite:", error);
        // Revert on error
        setFavorites(prev => prev.filter(f => f.id !== tempId));
      }
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(f => f.product_id === productId || f.product?.id === productId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loadFavorites, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
