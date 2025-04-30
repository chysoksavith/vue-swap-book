<template>
  <td :colspan="colspan" class="text-center py-8">
    <div class="flex flex-col items-center justify-center gap-2">
      <slot name="icon">
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
      </slot>
      <p class="text-gray-500 font-medium">
        <slot>No data found</slot>
      </p>
    </div>
  </td>
</template>
<script setup lang="ts">
defineProps({
    colspan: {
        type: String,
        default: 1
    }
})
</script>
