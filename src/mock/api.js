import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "null");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
