<template>
  <header class="navbar bg-base-100 shadow-sm fixed top-0 left-0 w-full z-50">
    <div class="flex-none lg:hidden">
      <label
        for="my-drawer"
        class="btn btn-square btn-ghost"
        @click="$emit('toggle-drawer')"
      >
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </label>
    </div>

    <div class="flex-1 flex items-center justify-start">
      <h1 class="text-xl font-semibold ml-2">{{ currentRouteName }}</h1>
    </div>

    <div class="flex-none gap-2 flex items-center">
      <div class="form-control">
        <input
          type="text"
          placeholder="Search"
          class="input input-bordered w-24 md:w-auto"
        />
      </div>

      <!-- Notifications Dropdown -->
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <div class="indicator">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span class="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </div>
        <div
          tabindex="0"
          class="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
        >
          <div class="card-body">
            <span class="font-bold text-lg">3 Notifications</span>
            <div class="flex flex-col gap-2 mt-2">
              <a href="#" class="link link-hover">New message</a>
              <a href="#" class="link link-hover">System update</a>
              <a href="#" class="link link-hover">New user registered</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Dropdown -->
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img src="https://placehold.co/100" alt="Profile" />
          </div>
        </div>
        <ul
          tabindex="0"
          class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <a class="justify-between">
              Profile
              <span class="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const currentRouteName = computed(() => {
  return route.name || "Dashboard";
});
</script>

<style scoped>
header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
}

/* Mobile responsiveness */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
}

.input {
  width: 100%;
}

.btn-ghost {
  padding: 0;
}

.dropdown-content {
  width: auto;
  min-width: 200px;
}

.indicator {
  position: relative;
}

.indicator-item {
  position: absolute;
  top: -5px;
  right: -5px;
}
</style>
