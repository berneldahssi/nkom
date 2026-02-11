/**
 * API client — wraps axios with auth token handling.
 */

import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("nkom_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — handle 401 (token refresh)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("nkom_refresh_token");
        const { data } = await axios.post(`${API_BASE}/api/v1/auth/refresh`, {
          refresh_token: refreshToken,
        });
        localStorage.setItem("nkom_access_token", data.access_token);
        localStorage.setItem("nkom_refresh_token", data.refresh_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch {
        // Refresh failed — redirect to login
        localStorage.removeItem("nkom_access_token");
        localStorage.removeItem("nkom_refresh_token");
        if (typeof window !== "undefined") {
          window.location.href = "/auth";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
