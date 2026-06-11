// src/axiosConfig.js
import axios from "axios";

const getBaseUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return "";
  }
  const url = "https://api.starxproperties.in";

  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
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
