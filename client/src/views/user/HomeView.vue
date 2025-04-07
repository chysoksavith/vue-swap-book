<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const navigateToLogin = () => {
  router.push("/login");
};
</script>

<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">User Management</h1>
      <button
        @click="navigateToLogin"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Login
      </button>
    </div>  

    <!-- User list content will go here -->
    <div class="bg-white rounded-lg shadow p-6">
      <p>User list content...</p>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>
