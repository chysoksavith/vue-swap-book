import { useToast } from "vue-toastification";
import type { Category } from "../types/categories.type";
import api from "../config/axios";

const toast = useToast();

export const updateCategoryStatus = async (category: Category) => {
  try {
    const newStatus = category.published === 1 ? false : false;
    await api.patch(`/categories/${category.id}/status`, {
      published: newStatus,
    });
    category.published = newStatus ? 1 : 0;
    toast.success("Category status updated successfully");
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to update status");
    category.published = category.published === 1 ? 0 : 1;
    return false;
  }
};
