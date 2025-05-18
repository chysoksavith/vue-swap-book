import type { Category } from "../../types/categories.type";

export const buildCategoryTree = (categories: Category[]): Category[] => {
  const map = new Map<number | null, Category[]>();
  const tree: Category[] = [];

  // Create map
  categories.forEach((cat) => {
    if (!map.has(cat.parent_id)) {
      map.set(cat.parent_id, []);
    }
    map.get(cat.parent_id)?.push(cat);
  });

  // Build tree recursively
  const buildBranch = (
    parentId: number | null,
    level: number = 0
  ): Category[] => {
    return (map.get(parentId) || []).map((cat) => ({
      ...cat,
      level,
      children: buildBranch(cat.id, level + 1),
    }));
  };

  return buildBranch(null);
};

export const getChildIds = (
  categories: Category[],
  parentId: number
): number[] => {
  const children = categories.filter((c) => c.parent_id === parentId);
  let childIds: number[] = [];
  for (const child of children) {
    childIds.push(child.id);
    childIds = [...childIds, ...getChildIds(categories, child.id)];
  }
  return childIds;
};

export const hasChildren = (
  categories: Category[],
  category: Category | null
) => {
  if (!category) return false;
  return categories.some((c) => c.parent_id === category.id);
};

export const getParentName = (categories: Category[], parentId: number) => {
  const parent = categories.find((c) => c.id === parentId);
  return parent ? parent.name : "Unknown";
};
