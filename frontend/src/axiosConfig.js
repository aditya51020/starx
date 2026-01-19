// src/axiosConfig.js
import axios from "axios";

const getBaseUrl = () => {
  // Hardcoded to switch to new Hostinger VPS (ignoring potential old Railway env var)
  if (import.meta.env.MODE === 'development') {
    return "http://localhost:5000";
  }
  return "https://api.starxbuildtech.co.in";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

export default api;
