<script setup lang="ts">
import HeaderVue from "../components/admin/Header.vue";
import SidebarVue from "../components/admin/Sidebar.vue";
</script>
<template>
  <div class="admin-layout">
    <SidebarVue />
    <div class="main-content">
      <HeaderVue />
      <main>
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>
