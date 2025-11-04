// src/services/api.js
// API service for backend communication with JWT authentication

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

/**
 * Get the auth token from localStorage
 */
export function getAuthToken() {
  return localStorage.getItem("auth_token");
}

/**
 * Set the auth token in localStorage
 */
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

/**
 * Get the current user from localStorage
 */
export function getCurrentUser() {
  const userJson = localStorage.getItem("current_user");
  return userJson ? JSON.parse(userJson) : null;
}

/**
 * Set the current user in localStorage
 */
export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem("current_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("current_user");
  }
}

/**
 * Clear all auth data
 */
export function clearAuth() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("current_user");
}

/**
 * Make an authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  // If unauthorized, clear auth data
  if (response.status === 401) {
    clearAuth();
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============ Auth Endpoints ============

/**
 * Register a new user
 */
export async function register(email, password, fullName = null) {
  const data = await apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
    }),
  });
  return data;
}

/**
 * Login user and get JWT token
 */
export async function login(email, password) {
  // OAuth2PasswordRequestForm expects form data, not JSON
  const formData = new URLSearchParams();
  formData.append("username", email); // OAuth2 uses 'username' field
  formData.append("password", password);

  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Login failed" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  const data = await response.json();

  // Save token
  setAuthToken(data.access_token);

  // Fetch user info
  const user = await getCurrentUserInfo();
  setCurrentUser(user);

  return { token: data.access_token, user };
}

/**
 * Get current user information
 */
export async function getCurrentUserInfo() {
  return apiRequest("/api/auth/me");
}

/**
 * Update current user information
 */
export async function updateUserInfo(fullName) {
  const params = new URLSearchParams();
  if (fullName) params.append("full_name", fullName);

  return apiRequest(`/api/auth/me?${params.toString()}`, {
    method: "PUT",
  });
}

/**
 * Logout user
 */
export function logout() {
  clearAuth();
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getAuthToken();
}

// ============ Products Endpoints ============

export async function getProducts(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/api/products${queryString ? "?" + queryString : ""}`);
}

export async function getProduct(id) {
  return apiRequest(`/api/products/${id}`);
}

export async function searchProducts(query, params = {}) {
  const allParams = { q: query, ...params };
  const queryString = new URLSearchParams(allParams).toString();
  return apiRequest(`/api/products/search?${queryString}`);
}

// ============ Categories Endpoints ============

export async function getCategories() {
  return apiRequest("/api/categories");
}

export async function getCategory(id) {
  return apiRequest(`/api/categories/${id}`);
}

// ============ Favorites Endpoints (Protected) ============

export async function getFavorites() {
  return apiRequest("/api/favorites");
}

export async function addFavorite(productId) {
  return apiRequest("/api/favorites", {
    method: "POST",
    body: JSON.stringify({ product_id: productId }),
  });
}

export async function removeFavorite(productId) {
  return apiRequest(`/api/favorites/${productId}`, {
    method: "DELETE",
  });
}

export async function isFavorite(productId) {
  return apiRequest(`/api/favorites/${productId}/check`);
}

// ============ Orders Endpoints (Protected) ============

export async function getOrders() {
  return apiRequest("/api/orders");
}

export async function getOrder(id) {
  return apiRequest(`/api/orders/${id}`);
}

export async function createOrder(orderData) {
  return apiRequest("/api/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

// ============ Reviews Endpoints ============

export async function getProductReviews(productId) {
  return apiRequest(`/api/reviews/product/${productId}`);
}

export async function createReview(reviewData) {
  return apiRequest("/api/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
}

export async function updateReview(reviewId, reviewData) {
  return apiRequest(`/api/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(reviewData),
  });
}

export async function deleteReview(reviewId) {
  return apiRequest(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
}

export default {
  // Auth
  register,
  login,
  logout,
  getCurrentUserInfo,
  updateUserInfo,
  isAuthenticated,
  getAuthToken,

  // Products
  getProducts,
  getProduct,
  searchProducts,

  // Categories
  getCategories,
  getCategory,

  // Favorites
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,

  // Orders
  getOrders,
  getOrder,
  createOrder,

  // Reviews
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
};
