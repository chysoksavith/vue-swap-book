<template>
  <div
    class="menu p-4 w-80 min-h-full bg-base-100 text-base-content border-r border-base-300"
  >
    <!-- Sidebar header -->
    <div class="flex items-center mb-4 p-2">
      <div class="flex items-center space-x-2">
        <div class="avatar">
          <div
            class="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center"
          >
            <span class="text-xl font-bold">D</span>
          </div>
        </div>
        <div>
          <h1 class="text-xl font-bold">Dashboard</h1>
          <p class="text-xs opacity-70">v1.0.0</p>
        </div>
      </div>
    </div>

    <!-- Sidebar content -->
    <ul class="flex-1 space-y-1">
      <NavItem to="/admin/dashboard" icon="home" label="Dashboard" />

      <li class="menu-title">
        <span>Management</span>
      </li>

      <NavItem to="/admin/users" icon="users" label="Users" />
      <NavItem to="/products" icon="shopping-bag" label="Products" />

      <li>
        <details open>
          <summary>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span>Financial</span>
          </summary>
          <ul>
            <NavItem
              to="/transactions"
              icon="currency-dollar"
              label="Transactions"
            />
            <NavItem to="/invoices" icon="document-text" label="Invoices" />
            <NavItem to="/reports" icon="chart-bar" label="Reports" />
          </ul>
        </details>
      </li>

      <li class="menu-title">
        <span>Settings</span>
      </li>

      <NavItem to="/settings" icon="cog" label="Settings" />
      <NavItem to="/help" icon="question-mark-circle" label="Help Center" />
    </ul>

    <!-- Sidebar footer -->
    <div class="mt-auto p-4">
      <div class="flex items-center space-x-3">
        <div class="avatar">
          <div class="w-10 rounded-full">
            <img
              v-if="props.user && props.user.profile_image"
              :src="props.user.profile_image"
              alt="User avatar"
              class="w-full h-full object-cover"
            />

            <img
              v-else
              src="https://placehold.co/100"
              alt="User avatar"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <h3 class="font-medium">{{ props.user.name }}</h3>
          <p class="text-xs opacity-70">Role : {{ props.user.role }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavItem from "../../components/ui/NavItem.vue";
import { defineProps } from "vue";
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});
</script>
