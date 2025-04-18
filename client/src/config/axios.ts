import axios from "axios";
import { useAuthStore } from "../stores/auth.store";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       const authStore = useAuthStore();
//       const redirectPath = authStore.isAdmin ? "/admin/login" : "/";

//       // Clear auth and redirect
//       authStore.clearAuth();
//       window.location.href = redirectPath;
//     }
//     return Promise.reject(error);
//   }
// );
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      // Only logout if it's an auth error, not profile fetch
      if (!error.config.url.includes("/profile")) {
        const redirectPath = authStore.isAdmin ? "/admin/login" : "/";
        authStore.clearAuth();
        window.location.href = redirectPath;
      }
    }
    return Promise.reject(error);
  }
);
export default api;
