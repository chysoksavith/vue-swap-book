import { defineStore } from "pinia";
import { authService } from "../services/auth.service";
import type { User } from "../types/auth.types";
import type { UserProfile } from "../types/profile.type";
import { useProfileStore } from "./profileUser.store";

interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
  isLoading: boolean;
  returnUrl: string | null;
}

interface AuthResponse {
  token: string;
  user: User;
}

// Enhanced storage helper with type safety
const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error parsing storage item ${key}:`, error);
      return null; // Return null instead of undefined item
    }
  },
  set(key: string, value: unknown): void {
    if (typeof value === "string") {
      localStorage.setItem(key, value); // Store strings directly (e.g., token)
    } else {
      localStorage.setItem(key, JSON.stringify(value)); // Stringify objects
    }
  },
  remove(key: string): void {
    localStorage.removeItem(key);
  },
};

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: storage.get<User>("user"),
    token: localStorage.getItem("token"),
    returnUrl: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state): boolean => state.user?.role === "admin",
    currentUser: (state): User | null => state.user,
  },

  actions: {
    async login(email: string, password: string): Promise<AuthResponse> {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await authService.login({ email, password });
        this.setAuth(response);
        // Verify role access
        if (this.returnUrl?.includes("/admin") && !this.isAdmin) {
          this.clearAuth();
          throw new Error("Access denied. Admin privileges required.");
        }

        return response;
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during login";
        this.error = message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    setReturnUrl(url: string | null): void {
      this.returnUrl = url;
    },

    // async getProfile(): Promise<UserProfile> {
    //   if (!this.token) {
    //     throw new Error("Authentication required");
    //   }

    //   this.isLoading = true;
    //   this.error = null;

    //   try {
    //     const response = await authService.getProfile();
    //     this.user = response.user; // Update global state
    //     return response.user;
    //   } catch (error: unknown) {
    //     this.clearAuth();
    //     const message =
    //       error instanceof Error ? error.message : "Failed to fetch profile";
    //     this.error = message;
    //     throw new Error(message);
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
    async logout(): Promise<string> {
      if (!this.token) return "/";

      this.isLoading = true;
      this.error = null;

      try {
        const redirectPath = await authService.logout(this.user?.role);
        const profileStore = useProfileStore();
        profileStore.clearProfile();
        this.clearAuth();
        return redirectPath;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Logout failed";
        this.error = message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    setAuth(response: AuthResponse): void {
      const token = response.token.trim(); // Remove any spaces
      this.token = token;
      this.user = response.user;
      storage.set("token", token); // Store raw token
      storage.set("user", response.user);
    },
    clearAuth(): void {
      this.token = null;
      this.user = null;
      this.returnUrl = null;
      storage.remove("token");
      storage.remove("user");
    },

    clearError(): void {
      this.error = null;
    },

    async handleAuthError(message: string): Promise<void> {
      this.error = message;
      await this.logout();
    },

    // Additional helper methods
    // async refreshProfile(): Promise<void> {
    //   if (this.isAuthenticated) {
    //     await this.getProfile();
    //   }
    // },

    // Initialize auth state (call this when app starts)
    async initialize(): Promise<void> {
      if (this.token) {
        try {
          const isValid = await authService.validateToken();
          if (!isValid) {
            this.clearAuth();
          }
        } catch (error) {
          this.clearAuth();
        }
      }
    },
  },
});
