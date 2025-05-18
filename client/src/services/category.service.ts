import { useToast } from "vue-toastification";
import type { Category } from "../types/categories.type";
import api from "../config/axios";

const toast = useToast();

export const updateCategoryStatus = async (category: Category) => {
  try {
    const currentStatus = category.published === 1;
    const newStatus = !currentStatus;

    // Send boolean to backend
    const response = await api.patch(`/categories/${category.id}/status`, {
      published: newStatus,
    });

    // Update local category (keep as number: 1 or 0)
    category.published = newStatus ? 1 : 0;
    toast.success("Category status updated successfully");
    return true;
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to update status");
    return false;
  }
};
