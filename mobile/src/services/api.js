import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

// Create axios instance
console.log("Using API URL:", API_URL);
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem("jwt_token");
      await AsyncStorage.removeItem("user_data");
    }
    return Promise.reject(error);
  }
);

// ============ Authentication ============
export const authAPI = {
  // Login with Google using Firebase token
  googleLogin: async ({ idToken }) => {
    const response = await api.post("/api/auth/firebase-login", {
      firebase_token: idToken,
    });
    return response.data;
  },

  // Login with Firebase token (alias for compatibility)
  loginWithFirebase: async (firebaseToken) => {
    const response = await api.post("/api/auth/firebase-login", {
      firebase_token: firebaseToken,
    });
    return response.data;
  },

  // Register new user
  register: async (email, password, fullName) => {
    const response = await api.post("/api/auth/register", {
      email,
      password,
      full_name: fullName,
    });
    return response.data;
  },

  // Get current user info
  getCurrentUser: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },

  // Update user profile
  updateProfile: async (fullName) => {
    const response = await api.put("/api/auth/me", null, {
      params: { full_name: fullName },
    });
    return response.data;
  },
};

// ============ Products ============
export const productsAPI = {
  // Get all products with optional filters
  getProducts: async (params = {}) => {
    const response = await api.get("/api/products", { params });
    return response.data;
  },

  // Search products
  searchProducts: async (query, skip = 0, limit = 20) => {
    const response = await api.get("/api/products/search", {
      params: { q: query, skip, limit },
    });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await api.get("/api/products", {
      params: { destacado: true, limit: 10 },
    });
    return response.data;
  },
};

// ============ Categories ============
export const categoriesAPI = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get("/api/categories");
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },
};

// ============ Orders ============
export const ordersAPI = {
  // Get user orders
  getUserOrders: async () => {
    const response = await api.get("/api/orders");
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post("/api/orders", orderData);
    return response.data;
  },
};

// ============ Favorites ============
export const favoritesAPI = {
  // Get user favorites
  getFavorites: async () => {
    const response = await api.get("/api/favorites");
    return response.data;
  },

  // Add product to favorites
  addFavorite: async (productId) => {
    const response = await api.post("/api/favorites", {
      product_id: productId,
    });
    return response.data;
  },

  // Remove product from favorites
  removeFavorite: async (favoriteId) => {
    const response = await api.delete(`/api/favorites/${favoriteId}`);
    return response.data;
  },
};

// ============ Reviews ============
export const reviewsAPI = {
  // Get product reviews
  getProductReviews: async (productId) => {
    const response = await api.get(`/api/reviews/product/${productId}`);
    return response.data;
  },

  // Create review
  createReview: async (productId, rating, comment) => {
    const response = await api.post("/api/reviews", {
      product_id: productId,
      rating,
      comment,
    });
    return response.data;
  },
};

export default api;
