import { defineStore } from "pinia";
import type { UserProfile } from "../types/profile.type";
import { authService } from "../services/auth.service";

interface UserProfileState {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export const useProfileStore = defineStore("profile", {
  state: (): UserProfileState => ({
    userProfile: null,
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchProfile(): Promise<UserProfile> {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await authService.getProfile();
        this.userProfile = response.user;
        return response.user;
      } catch (error: unknown) {
        this.clearProfile();
        const message =
          error instanceof Error ? error.message : "Failed to fetch profile";
        this.error = message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    clearProfile(): void {
      this.userProfile = null;
      this.error = null;
    },
  },
});
