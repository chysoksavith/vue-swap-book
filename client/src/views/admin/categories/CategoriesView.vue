<template>
  <!-- loading state -->
  <div v-if="isLoading" class="flex justify-center items-center min-h-[60vh]">
    <div class="flex flex-col items-center gap-4">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="text-gray-500 font-medium">Loading categories data...</p>
    </div>
  </div>
  <div v-else>
    <div class="mx-auto"></div>
    <div class="card bg-base-100 shadow col-span-1 lg:col-span-3">
      <div class="card-body">
        <div class="flex justify-between items-center mb-3">
          <h2 class="card-title">Categories Management</h2>
          <button class="btn btn-sm btn-primary" @click="openCreateModal">
            Create
          </button>
        </div>
        <!-- table -->
        <div class="overflow-x-auto">
          <table class="table">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-3 text-left">ID</th>
                <th class="p-3 text-left">Name</th>
                <th class="p-3 text-left">Active</th>
                <th class="p-3 text-left">Created</th>
                <th class="p-3 text-left">Updated</th>
                <th class="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="categories.length === 0">
                <EmptyData colspan="6"> No categories found. </EmptyData>
              </tr>
              <template v-else>
                <tr
                  v-for="category in categories"
                  :key="category.id"
                  class="border-b hover:bg-gray-50"
                >
                  <td class="p-3 text-gray-500 text-sm">#{{ category.id }}</td>
                  <td class="p-3 font-medium">{{ category.name }}</td>
                  <td class="p-3">
                    <input
                      type="checkbox"
                      :checked="category.published === 1"
                      class="toggle toggle-success"
                    />
                  </td>
                  <td class="p-3 text-gray-600">
                    {{ formatDate(category?.created_at) }}
                  </td>
                  <td class="p-3 text-gray-600">
                    {{ formatDate(category?.updated_at) }}
                  </td>
                  <td class="p-3">
                    <div class="flex space-x-2">
                      <button
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="Edit"
                        @click="openEditModal(category)"
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
                        @click="confirmDelete(category)"
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
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <!-- create / edit modal -->
  <div>
    <dialog ref="categoryModal" class="modal">
      <div class="modal-box w-11/12 max-w-2xl">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold">{{ isEditing ? "Edit" : "Create" }}</h3>
          <button
            type="button"
            class="btn btn-sm btn-circle btn-ghost"
            @click="closeModal"
          >
            ✕
          </button>
        </div>
        <!-- form -->
        <form @submit.prevent="handleSubmit" class="space-y-4 mt-4">
          <div class="form-control">
            <label class="label"><span class="label-text">Name *</span></label>
            <input
              type="text"
              v-model="categoryForm.name"
              placeholder="Enter name category"
              class="input input-bordered w-full"
              :class="{ 'input-error': validationErrors.name }"
            />
            <p v-if="validationErrors.name" class="text-sm text-red-600">
              {{ validationErrors.name[0] }}
            </p>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                v-model="categoryForm.published"
                :true-value="1"
                :false-value="0"
                class="toggle toggle-success"
              />
              <span class="label-text">Active & InActive</span>
            </label>
          </div>
          <div class="modal-action">
            <button
              type="button"
              class="btn"
              @click="closeModal"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="loading loading-spinner"></span>
              {{ isSubmitting ? "Processing..." : "Submit" }}
            </button>
          </div>
        </form>
      </div>
      <!-- click outside to close -->
      <form method="dialog" class="modal-backdrop">
        <button @click="closeModal">close</button>
      </form>
    </dialog>
  </div>
  <!-- Delete Confirmation Modal -->
  <dialog ref="deleteModal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Confirm Deletion</h3>
      <p class="py-4">
        Are you sure you want to delete "{{ categoryToDelete?.name }}"?
      </p>
      <div class="modal-action">
        <button class="btn" @click="closeDeleteModal">Cancel</button>
        <button
          class="btn btn-error"
          @click="handleDelete"
          :disabled="isDeleting"
        >
          <span v-if="isDeleting" class="loading loading-spinner"></span>
          {{ isDeleting ? "Deleting..." : "Delete" }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeDeleteModal">close</button>
    </form>
  </dialog>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import type {
  CategoryForm,
  ValidationErrors,
  Categories,
} from "../../../types/categories.type";
import api from "../../../config/axios";
import EmptyData from "../../../components/EmptyData.vue";
import { formatDate } from "../../../utility/dateUtils";
import { useToast } from "vue-toastification";

const toast = useToast();
const categories = ref<Categories[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const categoryModal = ref<HTMLDialogElement | null>(null);
const deleteModal = ref<HTMLDialogElement | null>(null);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const isEditing = ref(false);
const validationErrors = ref<ValidationErrors>({});
const categoryToDelete = ref<Categories | null>(null);

const categoryForm = ref<CategoryForm>({
  name: "",
  published: 1,
});
const openCreateModal = () => {
  isEditing.value = false;
  categoryForm.value = { name: "", published: 1 };
  validationErrors.value = {};
  categoryModal.value?.showModal();
};
const openEditModal = (category: Categories) => {
  isEditing.value = true;
  categoryForm.value = {
    name: category.name,
    published: category.published,
    id: category.id,
  };
  validationErrors.value = {};
  categoryModal.value?.showModal();
};
const closeModal = () => {
  categoryModal.value?.close();
};

const validateForm = (): boolean => {
  validationErrors.value = {};
  let valid = true;

  if (!categoryForm.value.name.trim()) {
    validationErrors.value.name = "The name field is required.";
    valid = false;
  }

  return valid;
};
const closeDeleteModal = () => {
  deleteModal.value?.close();
};
const handleSubmit = async () => {
  if (!validateForm()) return;
  isSubmitting.value = true;
  try {
    if (isEditing.value) {
      await api.put(`/categories/${categoryForm.value.id}`, categoryForm.value);
    } else {
      await api.post("/categories", categoryForm.value);
    }
    await fetchCategories();
    toast.success(isEditing.value ? "Category updated" : "Category created");
    closeModal();
  } catch (err: any) {
    if (err.response?.status === 422) {
      validationErrors.value = err.response.data.errors;
    } else if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("An error occurred while saving the category");
    }
  } finally {
    isSubmitting.value = false;
  }
};
// delete
const confirmDelete = (category: Categories) => {
  categoryToDelete.value = category;
  deleteModal.value?.showModal();
};
const handleDelete = async () => {
  if (!categoryToDelete.value) return;
  isDeleting.value = true;
  try {
    await api.delete(`/categories/${categoryToDelete.value?.id}`);
    await fetchCategories();
    toast.success("Category deleted");
    closeDeleteModal();
  } catch (error) {
    console.error("Error deleting category:", err);
  } finally {
    isDeleting.value = false;
  }
};
const fetchCategories = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const { data } = await api.get("/categories");
    categories.value = data.data || data.categories;
    console.log("categories", categories.value);
  } catch (err: any) {
    error.value = err.response?.data?.message || "Failed to load categories";
    console.error("Error fetching users:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCategories();
});
</script>
