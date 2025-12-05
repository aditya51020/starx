// src/axiosConfig.js
import axios from "axios";

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || "http://localhost:5000";
  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

export default api;
