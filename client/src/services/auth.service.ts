import api from "../config/axios";
import type { User } from "../types/profile.type";

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
    console.log("login", data);
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
  async getProfile(): Promise<{ user: User }> {
    try {
      const { data } = await api.get<User>("/users/profile");
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

      // Clear return URL to prevent redirect loops
      localStorage.removeItem("returnUrl");

      return role === "admin" ? "/admin/login" : "/login";
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Logout failed");
    }
  },
};
