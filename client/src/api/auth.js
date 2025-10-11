import axios from "axios";

const AUTH_API_URL = `${window.location.origin}/api/auth`;

const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await authApi.post("/login", { username, password });
  return response.data;
};

export const register = async (username, password, email) => {
  const response = await authApi.post("/register", {
    username,
    password,
    email,
  });
  return response.data;
};

export const verifyToken = async () => {
  const response = await authApi.get("/verify");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await authApi.get("/me");
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
