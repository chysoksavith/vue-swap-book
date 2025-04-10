<template>
  <HeaderUser :user="user || {}" />
  <main>
    <router-view></router-view>
  </main>
  <FooterUser />
</template>
<script setup lang="ts">
import FooterUser from "../components/layoutsUsers/FooterUser.vue";
import HeaderUser from "../components/layoutsUsers/HeaderUser.vue";
import { useAuthStore } from "../stores/auth.store";
// get user form token
const authStore = useAuthStore();

const user = authStore.currentUser;
</script>
