<script setup lang="ts">
import HeaderVue from "../components/admin/Header.vue";
import SidebarVue from "../components/admin/Sidebar.vue";
</script>
<template>
  <div class="admin-layout">
    <div id="sidebar" class="active">
      <SidebarVue />
    </div>
    <div id="main">
      <HeaderVue />
      <div class="page-heading">
        <h3>Profile Statistics</h3>
      </div>
      <div class="page-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
