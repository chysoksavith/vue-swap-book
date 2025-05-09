import api from "../config/axios";
import type { UserProfile } from "../types/profile.type";

interface LoginCredentials {
  email: string;
  password: string;
}
interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}
export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/users/login", credentials);
    localStorage.setItem("token", data.token);
    console.log("login", data);
    console.log("Login response token:", data.token);
    return data;
  },

  async validateToken(): Promise<boolean> {
    try {
      await api.get("/users/validate-token");
      return true;
    } catch {
      return false;
    }
  },
  // get profile
  async getProfile(): Promise<{ user: UserProfile }> {
    try {
      const { data } = await api.get<UserProfile>("/users/profile");
      return { user: data };
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  },

  async logout(role?: string): Promise<string> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No active session");
    }
    try {
      await api.post("/users/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("authState");

      // Clear return URL to prevent redirect loops
      localStorage.removeItem("returnUrl");

      return role === "admin" ? "/admin/login" : "/login";
    } catch (error: any) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error(error.response?.data?.message || "Logout failed");
    }
  },
};
