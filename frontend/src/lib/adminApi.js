// Admin API helper for Nishwa Tours & Travels
// Handles:
// - Backend API URL
// - Admin token storage
// - Authorization headers
// - Authenticated Axios requests
// - Automatic token cleanup on 401

import axios from "axios";

/*
 * Backend URL
 *
 * If REACT_APP_BACKEND_URL is configured in Render,
 * it will be used.
 *
 * Otherwise, because frontend and backend are served
 * from the same Render domain, window.location.origin
 * will be used automatically.
 */
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || window.location.origin;

// Remove trailing slash if one exists
const CLEAN_BACKEND_URL = BACKEND_URL.replace(/\/+$/, "");

// Main API URL
export const API = `${CLEAN_BACKEND_URL}/api`;

// LocalStorage key used for the admin JWT token
const TOKEN_KEY = "nishwa_admin_token";

/**
 * Get saved admin token
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch (error) {
    console.error("Unable to read admin token:", error);
    return "";
  }
};

/**
 * Save admin token
 */
export const setToken = (token) => {
  try {
    if (!token) {
      console.warn("Attempted to save an empty admin token.");
      return;
    }

    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Unable to save admin token:", error);
  }
};

/**
 * Remove admin token
 */
export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Unable to clear admin token:", error);
  }
};

/**
 * Create Authorization header
 *
 * Result:
 * {
 *   Authorization: "Bearer YOUR_JWT_TOKEN"
 * }
 */
export const authHeader = () => {
  const token = getToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Authenticated Axios instance for Admin APIs
 */
export const adminAxios = axios.create({
  baseURL: API,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * Automatically attach the latest token to every admin request.
 *
 * This is safer than manually adding authHeader()
 * to every request.
 */
adminAxios.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Handle authentication errors.
 *
 * 401 = invalid/expired token
 *
 * 403 = authenticated request is not permitted.
 */
adminAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.warn("Admin session expired or token is invalid.");
      clearToken();
    }

    return Promise.reject(error);
  }
);

/**
 * Optional helper to check whether an admin is logged in.
 */
export const isAdminLoggedIn = () => {
  return Boolean(getToken());
};
