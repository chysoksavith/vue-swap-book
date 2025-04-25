<template>
  <!-- loading state -->
  <div v-if="isLoading" class="flex justify-center items-center min-h-[60vh]">
    <div class="flex flex-col items-center gap-4">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="text-gray-500 font-medium">Loading users data...</p>
    </div>
  </div>
  <div v-else>
    <div class="mx-auto">
      <!-- analytics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- total users -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title text-sm text-gray-500">Total Users</h2>
            <p class="text-3xl font-bold">{{ counts.total || 0 }}</p>
            <div class="flex justify-between text-xs mt-2">
              <span class="text-green-600">↑ 12% from last month</span>
            </div>
          </div>
        </div>
        <!-- By Role -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title text-sm text-gray-500">By Role</h2>
            <div class="flex justify-between">
              <div>
                <p class="text-xs text-gray-500">Admin</p>
                <p class="text-xl font-bold">{{ counts.byRole?.admin || 0 }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">User</p>
                <p class="text-xl font-bold">{{ counts.byRole?.user }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- By Gender -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title text-sm text-gray-500">By Gender</h2>
            <div class="flex justify-between">
              <div>
                <p class="text-xs text-gray-500">Male</p>
                <p class="text-xl font-bold">
                  {{ counts.byGender?.male || 0 }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Female</p>
                <p class="text-xl font-bold">
                  {{ counts.byGender?.female || 0 }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- By Status -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title text-sm text-gray-500">By Status</h2>
            <div class="flex justify-between">
              <div>
                <p class="text-xs text-gray-500">Active</p>
                <p class="text-xl font-bold">
                  {{ counts.byStatus?.active || 0 }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Inactive</p>
                <p class="text-xl font-bold">
                  {{ counts.byStatus?.inactive || 0 }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card bg-base-100 shadow col-span-1 lg:col-span-3">
      <div class="card-body">
        <div class="flex justify-between items-center mb-3">
          <h2 class="card-title">User Management</h2>
          <button
            class="btn btn-sm btn-primary"
            @click="userModal?.openModal()"
          >
            Create
          </button>
        </div>
        <!-- advance filter -->
        <div class="bg-gray-50 p-4 rounded-lg mb-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- search input -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Search</span>
              </label>
              <input
                type="text"
                placeholder="Name, Email, Phone"
                v-model="filters.search"
                @input="handleSearch"
                class="input input-bordered w-full"
              />
            </div>
            <!-- role filter -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Role</span>
              </label>
              <select
                class="select select-bordered w-full"
                v-model="filters.role"
                @change="fetchUsers"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <!-- gender filter -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Gender</span>
              </label>
              <select
                class="select select-bordered w-full"
                v-model="filters.gender"
                @change="fetchUsers"
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <!-- status filter -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Status</span>
              </label>
              <select
                class="select select-bordered w-full"
                v-model="filters.is_active"
                @change="fetchUsers"
              >
                <option value="">All Statuses</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          <!-- Date Range Filter -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Date Range</span>
              </label>
              <div class="flex space-x-2">
                <input
                  type="date"
                  class="input input-bordered w-full"
                  v-model="filters.date_from"
                  @change="fetchUsers"
                />
                <input
                  type="date"
                  class="input input-bordered w-full"
                  v-model="filters.date_to"
                  @change="fetchUsers"
                />
              </div>
            </div>

            <!-- Filter Actions -->
            <div class="form-control flex flex-col justify-end">
              <div class="flex space-x-2">
                <button class="btn btn-secondary" @click="resetFilters">
                  Reset
                </button>
                <button class="btn btn-primary" @click="fetchUsers">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- table -->
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
              <tr v-if="users.length === 0">
                <td colspan="9" class="text-center py-8">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p class="text-gray-500 font-medium">No users found</p>
                    <button
                      v-if="Object.values(filters).some((val) => val !== '')"
                      @click="resetFilters"
                      class="btn btn-sm btn-outline mt-2"
                    >
                      Clear filters
                    </button>
                  </div>
                </td>
              </tr>
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
                  <input
                    type="checkbox"
                    :checked="user.is_active === 1"
                    @change="handleUserUpdateStatus(user)"
                    class="toggle toggle-success"
                  />
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
        <!-- pagination -->
        <div
          class="flex flex-col md:flex-row justify-between items-center mt-4 gap-4"
          v-if="pagination.total > 0 && !isLoading"
        >
          <div class="text-sm text-gray-600">
            Showing {{ (currentPage - 1) * pagination.limit + 1 }} to
            {{ Math.min(currentPage * pagination.limit, pagination.total) }} of
            {{ pagination.total }} entries
          </div>
          <vue-awesome-paginate
            v-model="currentPage"
            :total-items="pagination.total"
            :items-per-page="pagination.limit"
            :max-pages-shown="5"
            :show-breakpoint-buttons="false"
            :show-jump-buttons="false"
          >
            <template #prev-button>
              <span class="pagination-button"> &laquo; </span>
            </template>
            <template #next-button>
              <span class="pagination-button"> &raquo; </span>
            </template>
          </vue-awesome-paginate>
        </div>
      </div>
    </div>
  </div>
  <!-- modal register -->
  <UserCreateModal
    ref="userModal"
    @user-created="handleUserCreated"
    @user-creation-error="handleCreationError"
  />
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import api from "../../config/axios";
import { VueAwesomePaginate } from "vue-awesome-paginate";
import type { Counts, Pagination, User } from "../../types/user_list.type";
import UserCreateModal from "../../components/modal/UserCreateModal.vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

const users = ref<User[]>([]);
const counts = ref<Counts>({
  total: 0,
  byRole: { admin: 0, user: 0 },
  byGender: { male: 0, female: 0 },
  byStatus: { active: 0, inactive: 0 },
});
const pagination = ref<Pagination>({
  total: 0,
  page: 1,
  limit: 15,
  totalPages: 1,
});
const isLoading = ref(true);
const error = ref("");
const currentPage = ref(1);

const filters = ref({
  search: "",
  role: "",
  gender: "",
  is_active: "",
  date_from: "",
  date_to: "",
  sort_by: "created_at",
  sort_order: "DESC",
});
let searchTimeout: number | null = null;

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchUsers();
  }, 500);
};
const resetFilters = () => {
  filters.value = {
    search: "",
    role: "",
    gender: "",
    is_active: "",
    date_from: "",
    date_to: "",
    sort_by: "created_at",
    sort_order: "DESC",
  };
  currentPage.value = 1;
  fetchUsers();
};
// watch for page change
watch(currentPage, (newPage) => {
  fetchUsers();
});
const fetchUsers = async () => {
  isLoading.value = true;
  error.value = "";
  try {
    const params = {
      page: currentPage.value,
      limit: pagination.value.limit,
      ...filters.value,
      // Ensure date rande is only sendif both date are present
      ...(filters.value.date_from && filters.value.date_to
        ? {
            date_from: filters.value.date_from,
            date_to: filters.value.date_to,
          }
        : {}),
    };
    const { data } = await api.get("/users", { params });
    users.value = data.data || data.users;
    counts.value = {
      total: data.pagination.total,
      byRole: data.counts.byRole,
      byGender: data.counts.byGender,
      byStatus: data.counts.byStatus,
    };
    pagination.value = {
      total: data.pagination.total,
      page: data.pagination.page || currentPage.value,
      limit: data.pagination.limit,
      totalPages: data.pagination.totalPages,
    };
    // Ensure currentPage doesn't exceed total pages
    if (currentPage.value > data.pagination.totalPages) {
      currentPage.value = data.pagination.totalPages;
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || "Failed to fetch users";
    console.error("Error fetching users:", err);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  }
};

// open modal create user
const userModal = ref<InstanceType<typeof UserCreateModal> | null>(null);

const handleUserCreated = (newUser: any) => {
  Swal.fire({
    icon: "success",
    title: "User Created!",
    text: "New user has been successfully created",
    timer: 3000,
    showConfirmButton: false,
  });
  fetchUsers().catch((error) => {
    Swal.fire({
      icon: "error",
      title: "Refresh Failed",
      text: "User created but failed to refresh list",
      timer: 4000,
    });
  });
};
const handleCreationError = (error: { message: string }) => {
  Swal.fire({
    icon: "error",
    title: "Creation Failed",
    text: error.message,
    timer: 4000,
  });
};
// update user status
const handleUserUpdateStatus = async (user: User) => {
  try {
    const newStatus = user.is_active === 1 ? false : true;
    await api.patch(`/users/${user.id}/status`, { is_active: newStatus });
    user.is_active = newStatus ? 1 : 0;
    useToast().success("User status updated successfully");
  } catch (error) {
    useToast().error("Failed to update user status");
    user.is_active = user.is_active === 1 ? 0 : 1;
  }
};
onMounted(async () => {
  fetchUsers();
});
</script>
<style scoped>
.pagination-container {
  display: flex;
  column-gap: 6px;
  align-items: center;
}

.paginate-buttons {
  height: 35px;
  width: 35px;
  border-radius: 6px;
  cursor: pointer;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.paginate-buttons:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

.active-page {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.active-page:hover {
  background-color: #2563eb;
  color: white;
}

.pagination-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  width: 35px;
  border-radius: 6px;
  cursor: pointer;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  transition: all 0.2s ease;
}

.pagination-button:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

.break-label {
  height: 35px;
  width: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #9ca3af;
  cursor: default;
}
</style>
