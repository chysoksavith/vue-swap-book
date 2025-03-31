<script setup lang="ts">
import HeaderVue from "../components/admin/Header.vue";
import SidebarVue from "../components/admin/Sidebar.vue";
</script>
<template>
  <SidebarVue />

  <HeaderVue />

  <router-view></router-view>
</template>
