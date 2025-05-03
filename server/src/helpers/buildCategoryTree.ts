import { Category } from "../models/Category";

export const buildCategoryTree = (categories: Category[]): Category[] => {
  const categoryMap = new Map<number, Category>();
  const rootCategories: Category[] = [];

  // first pass : create map of categories by ID
  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, children: [] });
  });
  // second pass: build tree structure
  categories.forEach((category) => {
    const categoryWithChildren = categoryMap.get(category.id)!;
    if (!categoryWithChildren) return;

    if (category.parent_id === null) {
      // root category
      rootCategories.push(categoryWithChildren);
    } else {
      // child category
      const parent = categoryMap.get(category.parent_id);
      if (parent && parent.children) {
        parent.children.push(categoryWithChildren);
      }
    }
  });
  return rootCategories;
};
