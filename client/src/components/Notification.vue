<!-- components/Notification.vue -->
<template>
  <div v-if="show" :class="['notification', type]">
    {{ message }}
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useNotificationStore } from "../stores/notification.store";

const notificationStore = useNotificationStore();
const { message, type, show } = storeToRefs(notificationStore);
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 16px;
  border-radius: 4px;
  color: white;
  z-index: 1000;
}
.notification.error {
  background: #ff4444;
}
.notification.success {
  background: #00c851;
}
.notification.info {
  background: #33b5e5;
}
</style>
