import type {
  CategoryForm,
  ValidationErrors,
} from "../../../types/categories.type";

export const validateCategoryForm = (form: CategoryForm): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!form.name.trim()) {
    errors.name = ["The name field is required."];
  } else if (form.name.trim().length < 2) {
    errors.name = ["The name must be at least 2 characters."];
  }

  return errors;
};

export const resetCategoryForm = (): CategoryForm => ({
  name: "",
  published: 1,
  parent_id: null,
});
