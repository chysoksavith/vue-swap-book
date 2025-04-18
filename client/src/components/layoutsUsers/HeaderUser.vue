<template>
  <div class="bg-white shadow-md p-3 flex justify-between items-center">
    <div>
      <template v-if="props.user?.name">
        <h3 class="font-medium">
          {{ props.user.name }}
        </h3>
      </template>
    </div>
    <div class="flex gap-2">
      <template v-if="!props.user?.name">
        <button
          @click="navigateToRegister"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Register
        </button>
        <button
          @click="navigateToLogin"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Login
        </button>
      </template>
      <button
        v-else
        @click="handleLogoutUser"
        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Logout
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { defineProps } from "vue";
import { useAuthStore } from "../../stores/auth.store";
import Swal from "sweetalert2";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});
const router = useRouter();
const authStore = useAuthStore();

const navigateToLogin = () => {
  router.push("/login");
};

const navigateToRegister = () => {
  router.push("/register");
};

const handleLogoutUser = async () => {
  try {
    await authStore.logout();

    // Check if the user is an admin and redirect accordingly
    if (authStore.isAdmin) {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }

    await Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been successfully logged out",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Logout failed:", error);
    Swal.fire({
      icon: "error",
      title: "Logout Failed",
      text: "An error occurred during logout",
    });
  }
};
</script>
