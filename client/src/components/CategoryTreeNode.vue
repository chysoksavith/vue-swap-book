<template>
  <div class="category-node group" :style="{ marginLeft: `${level * 1.5}rem` }">
    <div
      class="flex items-center gap-2 py-1 hover:bg-base-200 rounded transition-colors"
    >
      <!-- Expand/Collapse button -->
      <button
        v-if="hasChildren"
        @click="toggleExpand"
        class="btn btn-ghost btn-xs p-0 h-6 w-6 min-h-0 rounded-full"
        :title="isExpanded ? 'Collapse' : 'Expand'"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 transition-transform duration-200"
          :class="{ 'transform rotate-90': isExpanded }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
      <div v-else class="w-6"></div>

      <!-- Category info -->
      <div class="flex-grow flex items-center gap-2 min-w-0">
        <span class="font-medium truncate">{{ category.name }}</span>
        <span
          class="badge badge-sm"
          :class="category.published ? 'badge-success' : 'badge-error'"
        >
          {{ category.published ? "Active" : "Inactive" }}
        </span>
      </div>

      <!-- Actions (only show on hover) -->
      <div class="flex space-x-2 items-center gap-1">
        <!-- Toggle status button -->
        <div>
          <input
            type="checkbox"
            :checked="category.published === 1"
            @change="$emit('toggle-status', category)"
            class="toggle toggle-success toggle-sm"
          />
        </div>
        <!-- Edit button -->
        <button
          @click="$emit('edit', category)"
          class="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
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

        <!-- Delete button -->
        <button
          @click="$emit('delete', category)"
          class="p-2 text-red-600 hover:bg-red-50 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
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
      </div>
    </div>

    <!-- Children -->
    <div
      v-if="isExpanded && hasChildren"
      class="mt-1 ml-2 pl-2 border-l-2 border-base-300"
    >
      <CategoryTreeNode
        v-for="child in category.children"
        :key="child.id"
        :category="child"
        :level="level + 1"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @toggle-status="$emit('toggle-status', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Category } from "../types/categories.type";

const props = defineProps<{
  category: Category;
  level: number;
}>();

defineEmits<{
  (e: "edit", category: Category): void;
  (e: "delete", category: Category): void;
  (e: "toggle-status", category: Category): void;
}>();

// Check if category has children
const hasChildren = computed(() => {
  return props.category.children && props.category.children.length > 0;
});

// Auto-expand first two levels
const isExpanded = ref(props.level < 2);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>
