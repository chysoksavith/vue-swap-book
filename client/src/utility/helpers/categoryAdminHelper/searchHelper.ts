import type { Ref } from "vue";

export const createSearchHandler = (
  searchQuery: Ref<string>,
  currentPage: Ref<number>,
  fetchFunction: () => void,
  delay: number = 500
) => {
  let searchTimeout: ReturnType<typeof setTimeout>;

  return () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentPage.value = 1;
      fetchFunction();
    }, delay);
  };
};
