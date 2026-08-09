import axios from "axios";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "https://nishwa-trips.onrender.com";

export const API = `${BACKEND_URL}/api`;

const TOKEN_KEY = "nishwa_admin_token";

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || "";
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const authHeader = () => {
  const token = getToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const adminAxios = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Automatically attach admin token
adminAxios.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Clear expired/invalid token
adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearToken();
    }

    return Promise.reject(error);
  }
);
