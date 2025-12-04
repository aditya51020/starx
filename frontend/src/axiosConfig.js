// src/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD ? "" : "http://localhost:5000",
  withCredentials: true
});

export default api;
