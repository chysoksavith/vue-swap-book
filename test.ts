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
import { VueAwesomePaginate } from "vue-awesome-paginate";
import { updateCategoryStatus } from "../../../services/category.service";
import {
  buildCategoryTree,
  getChildIds,
  hasChildren,
  getParentName,
} from "../../../utils/categoryUtil";
import { validateCategoryForm, resetCategoryForm } from "../../../utils/formHelper";
import { handlePageChange, handleItemsPerPageChange } from "../../../utils/paginationHelper";
import { createSearchHandler } from "../../../utils/searchHelper";

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
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const searchQuery = ref("");
const categoryForm = ref<CategoryForm>(resetCategoryForm());

// check if current category has child class
const isCategoryHasChildren = computed(() => {
  if (!isEditing.value || !categoryForm.value.id) return false;
  return hasChildren(categories.value, { id: categoryForm.value.id } as Category);
});

// computed
const categoryTree = computed(() => buildCategoryTree(categories.value));

const availableParentCategories = computed(() => {
  if (isEditing.value && categoryForm.value.id) {
    // When editing, exclude the current category and its children from parent options
    const excludeIds = getChildIds(categories.value, categoryForm.value.id);
    excludeIds.push(categoryForm.value.id);
    return categories.value.filter((cat) => !excludeIds.includes(cat.id));
  }
  return categories.value;
});

// watch for viewmode change to refresh category
watch(viewMode, () => {
  fetchCategories();
});

const pagination = computed(() => ({
  total: totalItems.value,
  limit: itemsPerPage.value,
  currentPage: currentPage.value,
}));

// method
const fetchCategories = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const { data } = await api.get("/categories", {
      params: {
        format: "flat",
        page: currentPage.value,
        limit: itemsPerPage.value,
        search: searchQuery.value,
      },
    });

    if (data.data) {
      categories.value = data.data;
      if (data.pagination) {
        totalItems.value = data.pagination.totalItems || 0;
      } else if (data.meta) {
        totalItems.value = data.meta.total || 0;
      }
    } else if (data.categories) {
      categories.value = data.categories;
      totalItems.value = data.total || categories.value.length;
    } else {
      categories.value = data;
      totalItems.value = data.length;
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || "Failed to load categories";
    console.error("Error fetching categories:", err);
    toast.error("Failed to load categories");
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = createSearchHandler(searchQuery, currentPage, fetchCategories);

const validateForm = (): boolean => {
  validationErrors.value = validateCategoryForm(categoryForm.value);
  return Object.keys(validationErrors.value).length === 0;
};

const openCreateModal = () => {
  isEditing.value = false;
  categoryForm.value = resetCategoryForm();
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
  await updateCategoryStatus(category);
};

onMounted(() => {
  fetchCategories();
});
</script>