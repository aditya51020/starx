// src/axiosConfig.js
import axios from "axios";

const getBaseUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return "http://localhost:5000";
  }
  const url = "https://api.starxbuildtech.co.in";

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
