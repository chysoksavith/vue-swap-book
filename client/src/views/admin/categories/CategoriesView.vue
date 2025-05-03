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
          <div class="flex gap-2">
            <select v-model="viewMode" class="select select-bordered select-sm">
              <option value="flat">Flat View</option>
              <option value="tree">Tree View</option>
            </select>
            <button class="btn btn-sm btn-primary" @click="openCreateModal">
              Create
            </button>
          </div>
        </div>
        <!-- Tree view -->
        <div
          v-if="viewMode === 'tree' && categoryTree.length > 0"
          class="space-y-2"
        >
          <CategoryTreeNode
            v-for="category in categoryTree"
            :key="category.id"
            :category="category"
            :level="0"
            @edit="openEditModal"
            @delete="confirmDelete"
            @toggle-status="handleStatusChange"
          />
        </div>

        <!-- table -->
        <div v-else-if="viewMode === 'flat'">
          <div class="overflow-x-auto">
            <table class="table">
              <thead class="bg-gray-100">
                <tr>
                  <th class="p-3 text-left">ID</th>
                  <th class="p-3 text-left">Name</th>
                  <th class="p-3 text-left">Parent</th>
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
                    <td class="p-3 text-gray-500 text-sm">
                      #{{ category.id }}
                    </td>
                    <td class="p-3 font-medium">{{ category.name }}</td>
                    <td class="p-3">
                      <span
                        v-if="category.parent_id"
                        class="badge badge-outline"
                      >
                        {{ getParentName(category.parent_id) }}
                      </span>
                      <span v-else class="text-gray-400">None</span>
                    </td>
                    <td class="p-3">
                      <input
                        type="checkbox"
                        :checked="category.published === 1"
                        @change="handleStatusChange(category)"
                        class="toggle toggle-success toggle-sm"
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
            <label class="label"
              ><span class="label-text">Category Name *</span></label
            >
            <input
              type="text"
              v-model="categoryForm.name"
              placeholder="Enter name category"
              class="input input-bordered w-full"
              :class="{ 'input-error': validationErrors.name }"
            />
            <label class="label" v-if="validationErrors.name">
              <span class="label-text-alt text-error">{{
                validationErrors.name[0]
              }}</span>
            </label>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Parent Category</span>
            </label>
            <select
              v-model="categoryForm.parent_id"
              class="select select-bordered w-full"
            >
              <option :value="null">No Parent (Top Level)</option>
              <option
                v-for="cat in availableParentCategories"
                :key="cat.id"
                :value="cat.id"
                :disabled="cat.id === categoryForm.id"
              >
                {{ cat.name }}
                <template v-if="hasChildren({ id: cat.id } as Category)">
                  (has children)
                </template>
              </option>
            </select>
            <label class="label" v-if="isCategoryHasChildren">
              <span class="label-text-alt text-info">
                Subcategories will move with this category
              </span>
            </label>
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
      <p class="text-sm text-warning" v-if="hasChildren(categoryToDelete)">
        Warning: This category has subcategories that will also be deleted!
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
import { computed, onMounted, ref, watch } from "vue";
import type {
  CategoryForm,
  ValidationErrors,
  Category,
} from "../../../types/categories.type";
import api from "../../../config/axios";
import EmptyData from "../../../components/EmptyData.vue";
import { formatDate } from "../../../utility/dateUtils";
import { useToast } from "vue-toastification";
import CategoryTreeNode from "../../../components/CategoryTreeNode.vue";

const toast = useToast();
// Data
const isLoading = ref(true);
const error = ref<string | null>(null);
const categories = ref<Category[]>([]);
const viewMode = ref<"flat" | "tree">("flat");
const categoryModal = ref<HTMLDialogElement | null>(null);
const deleteModal = ref<HTMLDialogElement | null>(null);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const isEditing = ref(false);
const validationErrors = ref<ValidationErrors>({});
const categoryToDelete = ref<Category | null>(null);
const originalParentId = ref<number | null>(null);

const categoryForm = ref<CategoryForm>({
  name: "",
  published: 1,
  parent_id: null,
});
// check if current category has child class
const isCategoryHasChildren = computed(() => {
  if (!isEditing.value || !categoryForm.value.id) return false;
  return hasChildren({ id: categoryForm.value.id } as Category);
});
// computed
const categoryTree = computed(() => {
  // Create a map for quick lookup
  const categoryMap = new Map<number | null, Category[]>();

  // Initialize map with empty arrays
  categories.value.forEach((cat) => {
    if (!categoryMap.has(cat.parent_id)) {
      categoryMap.set(cat.parent_id, []);
    }
    categoryMap.get(cat.parent_id)?.push(cat);
  });

  // Recursive function to build tree
  const buildTree = (
    parentId: number | null,
    level: number = 0
  ): Category[] => {
    const children = categoryMap.get(parentId) || [];
    return children.map((child) => ({
      ...child,
      level,
      children: buildTree(child.id, level + 1),
    }));
  };

  return buildTree(null);
});
const availableParentCategories = computed(() => {
  if (isEditing.value && categoryForm.value.id) {
    // When editing, exclude the current category and its children from parent options
    const excludeIds = getChildIds(categoryForm.value.id);
    excludeIds.push(categoryForm.value.id);
    return categories.value.filter((cat) => !excludeIds.includes(cat.id));
  }
  return categories.value;
});
// watch for viewmode change to refresh category
watch(viewMode, () => {
  fetchCategories();
});
// method
const fetchCategories = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // Always fetch flat data - we'll build the tree ourselves
    const { data } = await api.get("/categories", {
      params: { format: "flat" },
    });

    // Store the categories data
    categories.value = data.categories || data;
    console.log("categoryu", categories.value);
  } catch (err: any) {
    error.value = err.response?.data?.message || "Failed to load categories";
    console.error("Error fetching categories:", err);
    toast.error("Failed to load categories");
  } finally {
    isLoading.value = false;
  }
};

// Explicit tree building function
const buildCategoryTree = (categories: Category[]): Category[] => {
  const map = new Map<number | null, Category[]>();
  const tree: Category[] = [];

  // Create map
  categories.forEach((cat) => {
    if (!map.has(cat.parent_id)) {
      map.set(cat.parent_id, []);
    }
    map.get(cat.parent_id)?.push(cat);
  });

  // Build tree recursively
  const buildBranch = (
    parentId: number | null,
    level: number = 0
  ): Category[] => {
    return (map.get(parentId) || []).map((cat) => ({
      ...cat,
      level,
      children: buildBranch(cat.id, level + 1),
    }));
  };

  return buildBranch(null);
};

const getParentName = (parentId: number) => {
  const parent = categories.value.find((c) => c.id === parentId);
  return parent ? parent.name : "Unknown";
};

const getChildIds = (parentId: number): number[] => {
  const children = categories.value.filter((c) => c.parent_id === parentId);
  let childIds: number[] = [];
  for (const child of children) {
    childIds.push(child.id);
    childIds = [...childIds, ...getChildIds(child.id)];
  }
  return childIds;
};

const hasChildren = (category: Category | null) => {
  if (!category) return false;
  return categories.value.some((c) => c.parent_id === category.id);
};
const validateForm = (): boolean => {
  validationErrors.value = {};
  let valid = true;

  if (!categoryForm.value.name.trim()) {
    validationErrors.value.name = ["The name field is required."];
    valid = false;
  } else if (categoryForm.value.name.trim().length < 2) {
    validationErrors.value.name = ["The name must be at least 2 characters."];
    valid = false;
  }

  return valid;
};

const openCreateModal = () => {
  isEditing.value = false;
  categoryForm.value = { name: "", published: 1, parent_id: null };
  validationErrors.value = {};
  categoryModal.value?.showModal();
};
const openEditModal = (category: Category) => {
  isEditing.value = true;
  originalParentId.value = category.parent_id;
  categoryForm.value = {
    id: category.id,
    name: category.name,
    published: category.published,
    parent_id: category.parent_id,
  };
  validationErrors.value = {};
  categoryModal.value?.showModal();
};
const closeModal = () => {
  categoryModal.value?.close();
};

const closeDeleteModal = () => {
  deleteModal.value?.close();
};
const handleSubmit = async () => {
  if (!validateForm()) return;
  isSubmitting.value = true;
  try {
    if (isEditing.value) {
      if (
        categoryForm.value.parent_id !== originalParentId.value &&
        isCategoryHasChildren.value
      ) {
        const confirmed = confirm(
          "This will move all subcategories with it. Continue?"
        );
        if (!confirmed) return;
      }

      await api.put(`/categories/${categoryForm.value.id}`, categoryForm.value);
      toast.success("Category hierarchy updated");
    } else {
      await api.post("/categories", categoryForm.value);
      toast.success("Category created successfully");
    }
    await fetchCategories();
    closeModal();
  } catch (err: any) {
    if (err.response?.status === 422) {
      validationErrors.value = err.response.data.errors;
    } else {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  } finally {
    isSubmitting.value = false;
  }
};
// delete
const confirmDelete = (category: Category) => {
  categoryToDelete.value = category;
  deleteModal.value?.showModal();
};
const handleDelete = async () => {
  if (!categoryToDelete.value) return;
  isDeleting.value = true;
  try {
    await api.delete(`/categories/${categoryToDelete.value?.id}`);
    toast.success("Category deleted successfully");
    await fetchCategories();
    closeDeleteModal();
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to delete category");
  } finally {
    isDeleting.value = false;
  }
};
// handleStatusChange
const handleStatusChange = async (category: Category) => {
  try {
    const newStatus = category.published === 1 ? false : true;
    await api.patch(`/categories/${category.id}/status`, {
      published: newStatus,
    });
    category.published = newStatus ? 1 : 0;
    toast.success("Status updated");
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to update status");
    category.published = category.published === 1 ? 0 : 1;
  }
};

onMounted(() => {
  fetchCategories();
});
</script>
