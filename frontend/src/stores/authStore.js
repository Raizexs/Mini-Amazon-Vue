// src/stores/authStore.js
// Auth state management using Vue reactivity

import { reactive, computed } from "vue";
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  getCurrentUserInfo,
  getAuthToken,
  getCurrentUser,
  setCurrentUser,
  clearAuth,
} from "@/services/api";

const state = reactive({
  user: getCurrentUser(),
  token: getAuthToken(),
  loading: false,
  error: null,
});

// Computed properties
export const isAuthenticated = computed(() => !!state.token && !!state.user);
export const currentUser = computed(() => state.user);
export const isLoading = computed(() => state.loading);
export const authError = computed(() => state.error);

/**
 * Initialize auth state from localStorage
 */
export async function initAuth() {
  const token = getAuthToken();
  const user = getCurrentUser();

  if (token && user) {
    state.token = token;
    state.user = user;

    // Verify token is still valid by fetching user info
    try {
      const freshUser = await getCurrentUserInfo();
      state.user = freshUser;
      setCurrentUser(freshUser);
    } catch (error) {
      // Token is invalid, clear auth
      console.warn("Token validation failed:", error.message);
      clearAuthState();
    }
  }
}

/**
 * Register a new user
 */
export async function register(email, password, fullName = null) {
  state.loading = true;
  state.error = null;

  try {
    const user = await apiRegister(email, password, fullName);

    // Don't auto-login, just return the user
    // User will be redirected to login page

    return user;
  } catch (error) {
    state.error = error.message;
    throw error;
  } finally {
    state.loading = false;
  }
}

/**
 * Login user
 */
export async function login(email, password) {
  state.loading = true;
  state.error = null;

  try {
    const { token, user } = await apiLogin(email, password);

    state.token = token;
    state.user = user;

    return user;
  } catch (error) {
    state.error = error.message;
    clearAuthState();
    throw error;
  } finally {
    state.loading = false;
  }
}

/**
 * Logout user
 */
export function logout() {
  apiLogout();
  clearAuthState();
}

/**
 * Clear auth state
 */
function clearAuthState() {
  clearAuth();
  state.token = null;
  state.user = null;
  state.error = null;
}

/**
 * Clear error
 */
export function clearError() {
  state.error = null;
}

/**
 * Refresh user info
 */
export async function refreshUser() {
  if (!state.token) return;

  try {
    const user = await getCurrentUserInfo();
    state.user = user;
    setCurrentUser(user);
  } catch (error) {
    console.error("Failed to refresh user:", error);
    clearAuthState();
  }
}

export default {
  // State
  state,

  // Computed
  isAuthenticated,
  currentUser,
  isLoading,
  authError,

  // Actions
  initAuth,
  register,
  login,
  logout,
  clearError,
  refreshUser,
};
