import axios from "axios";
import { useAuthStore } from "../stores/auth.store";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.token || localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token
      .replace(/^"(.*)"$/, "$1")
      .trim()}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();

    // Only handle 401 errors and only if we had a token
    if (error.response?.status === 401 && authStore.isAuthenticated) {
      // Clear auth state
      await authStore.logout();

      // Redirect to login
      window.location.href = authStore.isAdmin ? "/admin/login" : "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
