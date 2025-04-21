import { defineStore } from "pinia";
import { authService } from "../services/auth.service";
import type { UserProfile } from "../types/profile.type";

interface ApiProfileState {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export const useApiProfileStore = defineStore("apiProfile", {
  state: (): ApiProfileState => ({
    userProfile: null, // In-memory state, no localStorage
    isLoading: false,
    error: null,
  }),

  getters: {
    currentProfile: (state): UserProfile | null => state.userProfile,
  },

  actions: {
    async getProfile(): Promise<UserProfile> {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await authService.getProfile();
        this.userProfile = response.user; // Update in-memory state
        return response.user;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch profile";
        this.error = message;
        throw new Error(message);
      } finally {
        this.isLoading = false;
      }
    },

    clearProfile(): void {
      this.userProfile = null;
      this.error = null;
    },
  },
});<template>
<div>
  <h1>Settings for {{ apiProfileStore.userProfile?.email || "Loading..." }}</h1>
  <!-- Sensitive settings form -->
</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useApiProfileStore } from "../stores/apiProfile.store";

const apiProfileStore = useApiProfileStore();

onMounted(async () => {
if (!apiProfileStore.userProfile) {
  await apiProfileStore.getProfile();
}
});
</script>