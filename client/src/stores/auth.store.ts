import { defineStore } from "pinia";
import { authService } from "../services/auth.service";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}
interface AuthState {
  user: User | null;
  token: string | null;
  returnUrl: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token"),
    returnUrl: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await authService.login({ email, password });
        this.setAuth(response);
        return response;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
    },
    // return url
    setReturnUrl(url: string | null) {
      this.returnUrl = url;
    },
    //  logout
    async logout() {
      try {
        if (!this.token) {
          throw new Error("No active session");
        }
        await authService.logout();
        this.clearAuth();
      } catch (error: any) {
        this.clearAuth();
        throw new Error(error.response?.data?.message || "Logout failed");
      }
    },
    setAuth(response: { token: string; user: User }) {
      this.token = response.token;
      this.user = response.user;
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    },
    clearAuth() {
      this.token = null;
      this.user = null;
      this.returnUrl = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
