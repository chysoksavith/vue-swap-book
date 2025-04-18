<template>
  <div class="card bg-base-100 shadow col-span-1 lg:col-span-3">
    <div class="card-body">
      <div class="flex justify-between items-center mb-3">
        <h2 class="card-title">User</h2>
        <button class="btn btn-sm btn-primary">Create</button>
      </div>
      <div class="overflow-x-auto">
        <table class="table">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-3 text-left">Photo</th>
              <th class="p-3 text-left">Name</th>
              <th class="p-3 text-left">Email</th>
              <th class="p-3 text-left">Phone</th>
              <th class="p-3 text-left">Gender</th>
              <th class="p-3 text-left">Active</th>
              <th class="p-3 text-left">Role</th>
              <th class="p-3 text-left">ID</th>
              <th class="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="p-3">
                <div class="avatar">
                  <div class="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      :src="
                        user.profile_image ||
                        'https://www.gravatar.com/avatar/?d=mp'
                      "
                      :alt="user.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </td>
              <td class="p-3 font-medium">{{ user.name }}</td>
              <td class="p-3 text-gray-600">{{ user.email }}</td>
              <td class="p-3">{{ user.phone || "-" }}</td>
              <td class="p-3 capitalize">{{ user.gender || "-" }}</td>
              <td class="p-3">
                <span
                  :class="user.is_active ? 'text-green-600' : 'text-red-500'"
                >
                  {{ user.is_active ? "Yes" : "No" }}
                </span>
              </td>
              <td class="p-3">
                <span
                  :class="{
                    'bg-purple-100 text-purple-800': user.role === 'admin',
                    'bg-blue-100 text-blue-800': user.role === 'user',
                  }"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="p-3 text-gray-500 text-sm">#{{ user.id }}</td>
              <td class="p-3">
                <div class="flex space-x-2">
                  <button
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    title="Edit"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    class="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    title="Delete"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <button
                    class="p-2 text-green-600 hover:bg-green-50 rounded-full"
                    title="View"
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import api from "../../config/axios";
interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  role: string;
  profile_image: string;
  gender: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const users = ref<User[]>([]);
const isLoading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    const { data } = await api.get<{ users: User[] }>("/users");
    users.value = data.users;
    console.log(users.value);
  } catch (err: unknown) {
  } finally {
    isLoading.value = false;
  }
});
</script>
