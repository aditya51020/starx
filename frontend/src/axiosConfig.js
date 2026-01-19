// src/axiosConfig.js
import axios from "axios";

const getBaseUrl = () => {
  // Hardcoded to switch to new Hostinger VPS (ignoring potential old Railway env var)
  if (import.meta.env.MODE === 'development') {
    return "http://localhost:5000";
  }
  const url = "https://api.starxbuildtech.co.in";
  console.log("%c API URL: " + url, "background: #222; color: #bada55; padding: 4px; font-size: 14px");
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
