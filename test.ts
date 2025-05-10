<script setup lang="ts">
// ... (keep your existing imports)

// Data
const isLoading = ref(true);
const error = ref<string | null>(null);
const categories = ref<Category[]>([]);
const viewMode = ref<"flat" | "tree">("flat");
const currentPage = ref(1);
const itemsPerPage = ref(10); // Changed from 1 to 10
const totalItems = ref(0);
const searchQuery = ref("");

// Add this computed property to replace the missing 'pagination' ref
const pagination = computed(() => ({
  total: totalItems.value,
  limit: itemsPerPage.value,
  currentPage: currentPage.value
}));

// ... (keep your other refs and computed properties)

// Modify your fetchCategories function
const fetchCategories = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const { data } = await api.get("/categories", {
      params: { 
        format: "flat",
        page: currentPage.value,
        limit: itemsPerPage.value,
        search: searchQuery.value 
      },
    });

    categories.value = data.data || data.categories || data;
    totalItems.value = data.pagination?.totalItems || data.total || categories.value.length;
    
  } catch (err: any) {
    error.value = err.response?.data?.message || "Failed to load categories";
    toast.error("Failed to load categories");
  } finally {
    isLoading.value = false;
  }
};

// Add this method to handle items per page change
const handleItemsPerPageChange = () => {
  currentPage.value = 1; // Reset to first page when changing items per page
  fetchCategories();
};

// ... (keep your other methods)
</script>

<template>
  <!-- ... (keep your existing template until the pagination section) -->

  <!-- Update the pagination section to this: -->
  <div class="flex flex-col md:flex-row justify-between items-center mt-4 gap-4" 
       v-if="totalItems > 0 && !isLoading">
    <div class="flex items-center gap-4">
      <div class="text-sm text-gray-600">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, totalItems) }}
        of {{ totalItems }} entries
      </div>
      <select 
        v-model="itemsPerPage" 
        @change="handleItemsPerPageChange"
        class="select select-bordered select-sm w-20"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
    
    <vue-awesome-paginate
      v-model="currentPage"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      :max-pages-shown="5"
      :on-click="handlePageChange"
    >
      <template #prev-button>
        <span class="pagination-button"> &laquo; </span>
      </template>
      <template #next-button>
        <span class="pagination-button"> &raquo; </span>
      </template>
    </vue-awesome-paginate>
  </div>

  <!-- ... (keep the rest of your template) -->
</template>

<style scoped>
/* Keep your existing styles */
</style>