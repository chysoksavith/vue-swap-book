<template>
  <div class="min-h-screen bg-base-200">
    <div class="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" class="drawer-toggle" />

      <!-- Page content -->
      <div class="drawer-content flex flex-col">
        <!-- Header -->
        <Header @toggle-drawer="toggleDrawer" />

        <!-- Main content -->
        <main class="flex-1 p-4 md:p-6 mt-16 lg:mt-0">
          <router-view />
        </main>
      </div>

      <!-- Sidebar -->
      <div class="drawer-side z-20">
        <label for="my-drawer" class="drawer-overlay lg:hidden"></label>
        <Sidebar :user="user" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Header from "./admin/Header.vue";
import Sidebar from "./admin/Sidebar.vue";
import { useAuthStore } from "../stores/auth.store";

const authStore = useAuthStore();
const drawerOpen = ref(false);

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value;
  document.getElementById("my-drawer").checked = drawerOpen.value;
};
const user = authStore.currentUser;
// onMounted(async () => {
//   if (authStore.isAuthenticated) {
//     try {
//       await authStore.getProfile();
//     } catch (error) {
//       console.error("Failed to fetch profile:", error);
//     }
//   }
// });
</script>
