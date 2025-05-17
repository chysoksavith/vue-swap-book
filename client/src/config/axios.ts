import axios from "axios";
import { useAuthStore } from "../stores/auth.store";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isHandlingUnauthorized = false;
// Request interceptor
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.token;
  if (config.url?.includes("/login") || config.url?.includes("/register")) {
    return config;
  }

  if (token && !isHandlingUnauthorized) {
    const cleanToken = token.replace(/^"(.*)"$/, "$1").trim();
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();
    const toast = useToast();
    const router = useRouter();

    if (
      isHandlingUnauthorized ||
      error.config.url?.includes("/login") ||
      error.config.url?.includes("/register")
    ) {
      return Promise.reject(error);
    }
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && authStore.isAuthenticated) {
      if (isHandlingUnauthorized) return Promise.reject(error);

      isHandlingUnauthorized = true; 
      toast.error("Your session has expired. Please log in again.");

      await authStore.logout();

      // Clear storage
      localStorage.removeItem("auth");
      sessionStorage.removeItem("auth");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");

      // Redirect to login (use router.replace to avoid history entry)
      const redirectPath = authStore.isAdmin ? "/admin/login" : "/login";
      router.replace(`${redirectPath}?sessionExpired=true`);

      isHandlingUnauthorized = false; // Reset flag
      return Promise.reject(error);
    }

    // Handle other errors (e.g., 400, 500)
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default api;
