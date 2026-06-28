// src/axiosConfig.js
import axios from "axios";

const getBaseUrl = () => {
  return "";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
