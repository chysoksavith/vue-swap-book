<template>
  <div class="min-h-screen bg-base-200">
    <div class="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" class="drawer-toggle" />

      <!-- Page content -->
      <div class="drawer-content flex flex-col">
        <!-- Header -->
        <Header @toggle-drawer="toggleDrawer" />

        <!-- Main content -->
        <main class="flex-1 p-4 md:p-6">
          <router-view />
        </main>
      </div>

      <!-- Sidebar -->
      <Sidebar />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Header from "./admin/Header.vue";
import Sidebar from "./admin/Sidebar.vue";

const drawerOpen = ref(false);

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value;
  document.getElementById("my-drawer").checked = drawerOpen.value;
};
</script>
