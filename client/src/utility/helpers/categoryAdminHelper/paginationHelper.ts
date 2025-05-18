import type { Ref } from "vue";

export const handlePageChange = (
  currentPage: Ref<number>,
  fetchFunction: () => void
) => {
  return (page: number) => {
    currentPage.value = page;
    fetchFunction();
  };
};

export const handleItemsPerPageChange = (
  currentPage: Ref<number>,
  fetchFunction: () => void
) => {
  return () => {
    currentPage.value = 1;
    fetchFunction();
  };
};
