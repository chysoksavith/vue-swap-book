<template>
  <div
    class="menu p-4 w-80 min-h-full bg-base-100 text-base-content border-r border-base-300"
  >
    <!-- Sidebar header -->
    <div class="flex items-center mb-4">
      <div class="flex items-center space-x-3">
        <div class="w-16 h-16 flex items-center justify-center">
          <img
            src="../../assets/swapbooklogo.png"
            alt="SwapBook Logo"
            class="w-full h-full object-contain"
            onerror="this.src='../../assets/logo-fallback.svg'; this.alt='SwapBook Logo Fallback'"
          />
        </div>
        <div>
          <h1 class="text-xl font-semibold text-gray-900">SwapBook</h1>
          <p class="text-xs text-gray-500">v1.0.0</p>
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
        <details :open="isActive('/books')">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span>Book management</span>
          </summary>
          <ul>
            <NavItem to="/admin/categories" icon="tag" label="Categories" />
            <NavItem to="/authors" icon="pencil" label="Authors" />
            <NavItem to="/books" icon="book-open" label="Books" />
          </ul>
        </details>
      </li>
      <li>
        <details :open="isActive('/expenses')">
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
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>Expenses</span>
          </summary>
          <ul>
            <NavItem to="/expenses" icon="currency-dollar" label="Expenses" />
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
import { defineProps, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + "/");
};
</script>
