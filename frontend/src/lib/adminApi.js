import axios from "axios";

/*
|--------------------------------------------------------------------------
| Backend URL
|--------------------------------------------------------------------------
|
| If Render has REACT_APP_BACKEND_URL configured, use it.
| Otherwise use the current website domain.
|
*/

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || window.location.origin;

const CLEAN_BACKEND_URL = BACKEND_URL.replace(/\/+$/, "");

/*
|--------------------------------------------------------------------------
| API Base URL
|--------------------------------------------------------------------------
*/

export const API = `${CLEAN_BACKEND_URL}/api`;

/*
|--------------------------------------------------------------------------
| Token Storage
|--------------------------------------------------------------------------
*/

const TOKEN_KEY = "nishwa_admin_token";

/*
|--------------------------------------------------------------------------
| Get Token
|--------------------------------------------------------------------------
*/

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch (error) {
    console.error("Unable to read admin token:", error);
    return "";
  }
};

/*
|--------------------------------------------------------------------------
| Save Token
|--------------------------------------------------------------------------
*/

export const setToken = (token) => {
  try {
    if (!token) {
      console.warn("Empty admin token received.");
      return;
    }

    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Unable to save admin token:", error);
  }
};

/*
|--------------------------------------------------------------------------
| Clear Token
|--------------------------------------------------------------------------
*/

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Unable to clear admin token:", error);
  }
};

/*
|--------------------------------------------------------------------------
| Authorization Header
|--------------------------------------------------------------------------
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

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

export const adminAxios = axios.create({
  baseURL: API,

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
|
| Automatically attaches:
|
| Authorization: Bearer YOUR_TOKEN
|
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

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
|
| If JWT expires or becomes invalid,
| remove it from localStorage.
|
*/

adminAxios.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.warn("Admin token expired or invalid.");

      clearToken();
    }

    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| Check Login
|--------------------------------------------------------------------------
*/

export const isAdminLoggedIn = () => {
  return Boolean(getToken());
};
