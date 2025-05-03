// models/Category.ts
export interface Category {
  id: number;
  name: string;
  slug: string;
  published: boolean;
  parent_id: number | null;
  created_at: Date;
  updated_at: Date;
  children?: Category[];
}

// controllers/categoryController.ts
import { Request, Response } from "express";
import pool from "../config/db";
import { Category } from "../models/Category";
import { RowDataPacket } from "mysql2";
import slugify from "slugify";

interface CategoryRow extends Category, RowDataPacket {}

// Helper function to build the category tree
const buildCategoryTree = (categories: Category[]): Category[] => {
  const categoryMap = new Map<number, Category>();
  const rootCategories: Category[] = [];

  // First pass: create a map of categories by ID
  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Second pass: build the tree structure
  categories.forEach((category) => {
    const categoryWithChildren = categoryMap.get(category.id);
    if (!categoryWithChildren) return;

    if (category.parent_id === null) {
      // Root category
      rootCategories.push(categoryWithChildren);
    } else {
      // Child category
      const parent = categoryMap.get(category.parent_id);
      if (parent && parent.children) {
        parent.children.push(categoryWithChildren);
      }
    }
  });

  return rootCategories;
};

// get all categories in tree format
export const getCategories = async (req: Request, res: Response) => {
  try {
    // Get the format parameter (tree or flat)
    const format = (req.query.format as string) || "flat";

    const [categories] = await pool.query<CategoryRow[]>(
      "SELECT id, name, slug, published, parent_id, created_at, updated_at FROM categories ORDER BY parent_id NULLS FIRST, name ASC"
    );

    if (!categories || categories.length === 0 || !Array.isArray(categories)) {
      return res.status(200).json({
        success: true,
        categories: [],
      });
    }

    // Return tree structure if requested
    if (format === "tree") {
      const categoryTree = buildCategoryTree(categories);
      return res.status(200).json({
        success: true,
        categories: categoryTree,
      });
    }

    // Default: return flat structure
    res.status(200).json({
      success: true,
      categories: categories,
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// get category by id with children
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get the primary category
    const [category] = await pool.query<CategoryRow[]>(
      "SELECT id, name, slug, published, parent_id, created_at, updated_at FROM categories WHERE id = ?",
      [id]
    );

    if (!category || category.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Get child categories if any
    const [children] = await pool.query<CategoryRow[]>(
      "SELECT id, name, slug, published, parent_id, created_at, updated_at FROM categories WHERE parent_id = ?",
      [id]
    );

    const categoryWithChildren = {
      ...category[0],
      children: children && children.length > 0 ? children : [],
    };

    res.status(200).json({
      success: true,
      category: categoryWithChildren,
    });
  } catch (error) {
    console.error("Error getting category:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, published = true, parent_id = null } = req.body;

    // validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Category name must be at least 2 characters long",
      });
    }

    // Generate slug
    const slug = slugify(name.toLowerCase(), {
      lower: true,
      strict: true,
      trim: true,
    });

    // check if category already exists with same name under same parent
    const [existingCategory] = await pool.query<CategoryRow[]>(
      "SELECT id FROM categories WHERE name = ? AND (parent_id = ? OR (parent_id IS NULL AND ? IS NULL))",
      [name.trim(), parent_id, parent_id]
    );

    if (existingCategory && existingCategory.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Category already exists at this level",
      });
    }

    // If parent_id provided, verify parent exists
    if (parent_id !== null) {
      const [parentExists] = await pool.query<CategoryRow[]>(
        "SELECT id FROM categories WHERE id = ?",
        [parent_id]
      );

      if (!parentExists || parentExists.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Parent category does not exist",
        });
      }
    }

    // create category
    const [result] = await pool.query(
      "INSERT INTO categories (name, slug, published, parent_id) VALUES (?, ?, ?, ?)",
      [name.trim(), slug, published, parent_id]
    );

    const insertId = (result as any).insertId;

    // Get the newly created category
    const [newCategory] = await pool.query<CategoryRow[]>(
      "SELECT id, name, slug, published, parent_id, created_at, updated_at FROM categories WHERE id = ?",
      [insertId]
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory[0],
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

// update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, published, parent_id } = req.body;

    // validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Category name must be at least 2 characters long",
      });
    }

    // Generate new slug
    const slug = slugify(name.toLowerCase(), {
      lower: true,
      strict: true,
      trim: true,
    });

    // check if category exists
    const [existingCategory] = await pool.query<CategoryRow[]>(
      "SELECT id, parent_id FROM categories WHERE id = ?",
      [id]
    );

    if (!existingCategory || existingCategory.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Prevent setting a category as its own parent or child
    if (parent_id !== null && parseInt(id) === parent_id) {
      return res.status(400).json({
        success: false,
        message: "A category cannot be its own parent",
      });
    }

    // Check if new parent_id would create a circular reference
    if (parent_id !== null) {
      // Check if this category is a parent of the selected parent
      const [potentialCycle] = await pool.query<CategoryRow[]>(
        `WITH RECURSIVE category_path (id, parent_id) AS (
          SELECT id, parent_id FROM categories WHERE id = ?
          UNION ALL
          SELECT c.id, c.parent_id FROM categories c
          JOIN category_path cp ON c.parent_id = cp.id
        )
        SELECT id FROM category_path WHERE id = ?`,
        [parent_id, id]
      );

      if (potentialCycle && potentialCycle.length > 1) {
        return res.status(400).json({
          success: false,
          message:
            "This would create a circular reference in the category hierarchy",
        });
      }
    }

    // check if name already exists at same level
    const [duplicateName] = await pool.query<CategoryRow[]>(
      "SELECT id FROM categories WHERE name = ? AND id != ? AND (parent_id = ? OR (parent_id IS NULL AND ? IS NULL))",
      [name.trim(), id, parent_id, parent_id]
    );

    if (duplicateName && duplicateName.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists at this level",
      });
    }

    // update category
    await pool.query(
      "UPDATE categories SET name = ?, slug = ?, published = ?, parent_id = ?, updated_at = NOW() WHERE id = ?",
      [name.trim(), slug, published, parent_id, id]
    );

    // Get the updated category
    const [updatedCategory] = await pool.query<CategoryRow[]>(
      "SELECT id, name, slug, published, parent_id, created_at, updated_at FROM categories WHERE id = ?",
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory[0],
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

// delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const [existingCategory] = await pool.query<CategoryRow[]>(
      "SELECT id FROM categories WHERE id = ?",
      [id]
    );

    if (!existingCategory || existingCategory.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category has children
    const [children] = await pool.query<CategoryRow[]>(
      "SELECT id FROM categories WHERE parent_id = ?",
      [id]
    );

    if (children && children.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete category with subcategories. Please delete subcategories first or reassign them.",
      });
    }

    // Check if category is being used in books or other related tables
    // This is an example - adjust based on your schema
    const [usedInBooks] = await pool.query(
      "SELECT id FROM books WHERE category_id = ? LIMIT 1",
      [id]
    );

    if (usedInBooks && (usedInBooks as any[]).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category that is being used by books",
      });
    }

    // Delete the category
    await pool.query("DELETE FROM categories WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};

// update category status
export const updateCategoryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { published } = req.body;

    if (typeof published !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid published status",
      });
    }

    const [result] = await pool.query(
      "UPDATE categories SET published = ?, updated_at = NOW() WHERE id = ?",
      [published, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category status updated successfully",
    });
  } catch (error) {
    console.error("Error updating category status:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Get a category's full path (breadcrumb)
export const getCategoryPath = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [path] = await pool.query(
      `WITH RECURSIVE category_path (id, name, parent_id, depth) AS (
        SELECT id, name, parent_id, 0 as depth FROM categories WHERE id = ?
        UNION ALL
        SELECT c.id, c.name, c.parent_id, cp.depth + 1 FROM categories c
        JOIN category_path cp ON c.id = cp.parent_id
      )
      SELECT * FROM category_path ORDER BY depth DESC`,
      [id]
    );

    if (!path || (path as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      path: path,
    });
  } catch (error) {
    console.error("Error getting category path:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
// types/categories.type.ts
export interface Category {
  id: number;
  name: string;
  slug: string;
  published: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  children?: Category[];
  depth?: number; // For breadcrumb path
  isExpanded?: boolean; // UI state
}

export interface CategoryForm {
  id?: number;
  name: string;
  published: number;
  parent_id?: number | null;
  slug?: string;
}

export interface ValidationErrors {
  name?: string[];
  published?: string[];
  parent_id?: string[];
  [key: string]: string[] | undefined;
}

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
  level: number;
  isVisible?: boolean;
}

export interface CategoryBreadcrumb {
  id: number;
  name: string;
}
<template>
  <!-- loading state -->
  <div v-if="isLoading" class="flex justify-center items-center min-h-[60vh]">
    <div class="flex flex-col items-center gap-4">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="text-gray-500 font-medium">Loading categories data...</p>
    </div>
  </div>
  <div v-else>
    <div class="mx-auto"></div>
    <div class="card bg-base-100 shadow col-span-1 lg:col-span-3">
      <div class="card-body">
        <div class="flex justify-between items-center mb-3">
          <div>
            <h2 class="card-title">Categories Management</h2>
            <div class="text-sm breadcrumbs">
              <ul>
                <li>
                  <a href="#" @click.prevent="loadRootCategories">All Categories</a>
                </li>
                <li v-for="breadcrumb in breadcrumbs" :key="breadcrumb.id">
                  <a href="#" @click.prevent="navigateToBreadcrumb(breadcrumb.id)">
                    {{ breadcrumb.name }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="flex gap-2">
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text mr-2">Tree View</span>
                <input
                  type="checkbox"
                  v-model="treeView"
                  class="toggle toggle-primary"
                  @change="toggleView"
                />
              </label>
            </div>
            <button class="btn btn-sm btn-primary" @click="openCreateModal()">
              Create Category
            </button>
          </div>
        </div>
        
        <!-- Tree View -->
        <div v-if="treeView" class="mb-4">
          <div class="overflow-x-auto">
            <table class="table">
              <thead class="bg-gray-100">
                <tr>
                  <th class="p-3 text-left">Category</th>
                  <th class="p-3 text-left">Status</th>
                  <th class="p-3 text-left">Created</th>
                  <th class="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="categoryTree.length === 0">
                  <EmptyData colspan="4">No categories found.</EmptyData>
                </tr>
                <template v-else>
                  <tr
                    v-for="(category, index) in displayedCategories"
                    :key="category.id"
                    class="border-b hover:bg-gray-50"
                    :class="{'bg-gray-50': category.level > 0}"
                  >
                    <td class="p-3">
                      <div class="flex items-center">
                        <div 
                          class="pr-2" 
                          :style="{paddingLeft: `${category.level * 20}px`}"
                        >
                          <button 
                            v-if="category.children && category.children.length > 0"
                            @click="toggleNode(category.id)"
                            class="p-1 rounded-full text-gray-600 hover:bg-gray-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              :class="{'rotate-90': category.isExpanded}"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                          <span v-else class="ml-5"></span>
                        </div>
                        <div class="font-medium">{{ category.name }}</div>
                      </div>
                    </td>
                    <td class="p-3">
                      <input
                        type="checkbox"
                        :checked="category.published === 1"
                        @change="handleStatusChange(category)"
                        class="toggle toggle-success toggle-sm"
                      />
                    </td>
                    <td class="p-3 text-gray-600 text-sm">
                      {{ formatDate(category?.created_at) }}
                    </td>
                    <td class="p-3">
                      <div class="flex space-x-2">
                        <button
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          title="Edit"
                          @click="openEditModal(category)"
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
                        <button
                          class="p-2 text-green-600 hover:bg-green-50 rounded-full"
                          title="Add Subcategory"
                          @click="openCreateModal(category.id)"
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
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </button>
                        <button
                          class="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          title="Delete"
                          @click="confirmDelete(category)"
                          :disabled="category.children && category.children.length > 0"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            :class="{'opacity-30': category.children && category.children.length > 0}"
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
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Flat View -->
        <div v-else>
          <div class="overflow-x-auto">
            <table class="table">
              <thead class="bg-gray-100">
                <tr>
                  <th class="p-3 text-left">ID</th>
                  <th class="p-3 text-left">Name</th>
                  <th class="p-3 text-left">Parent</th>
                  <th class="p-3 text-left">Status</th>
                  <th class="p-3 text-left">Created</th>
                  <th class="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="categories.length === 0">
                  <EmptyData colspan="6">No categories found.</EmptyData>
                </tr>
                <template v-else>
                  <tr
                    v-for="category in filteredCategories"
                    :key="category.id"
                    class="border-b hover:bg-gray-50"
                  >
                    <td class="p-3 text-gray-500 text-sm">#{{ category.id }}</td>
                    <td class="p-3 font-medium">
                      <a 
                        href="#" 
                        @click.prevent="loadSubcategories(category)" 
                        class="hover:underline"
                      >
                        {{ category.name }}
                      </a>  
                    </td>
                    <td class="p-3 text-sm text-gray-600">
                      {{ getParentName(category.parent_id) }}
                    </td>
                    <td class="p-3">
                      <input
                        type="checkbox"
                        :checked="category.published === 1"
                        @change="handleStatusChange(category)"
                        class="toggle toggle-success toggle-sm"
                      />
                    </td>
                    <td class="p-3 text-gray-600 text-sm">
                      {{ formatDate(category?.created_at) }}
                    </td>
                    <td class="p-3">
                      <div class="flex space-x-2">
                        <button
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          title="Edit"
                          @click="openEditModal(category)"
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
                        <button
                          class="p-2 text-green-600 hover:bg-green-50 rounded-full"
                          title="Add Subcategory"
                          @click="openCreateModal(category.id)"
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
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </button>
                        <button
                          class="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          title="Delete"
                          @click="confirmDelete(category)"
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
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- create / edit modal -->
  <div>
    <dialog ref="categoryModal" class="modal">
      <div class="modal-box w-11/12 max-w-2xl">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold">
            {{ isEditing ? "Edit Category" : "Create Category" }}
            <span v-if="selectedParentId && !isEditing" class="text-sm font-normal text-gray-500">
              (as subcategory)
            </span>
          </h3>
          <button
            type="button"
            class="btn btn-sm btn-circle btn-ghost"
            @click="closeModal"
          >
            ✕
          </button>
        </div>
        <!-- form -->
        <form @submit.prevent="handleSubmit" class="space-y-4 mt-4">
          <div class="form-control">
            <label class="label"><span class="label-text">Name *</span></label>
            <input
              type="text"
              v-model="categoryForm.name"
              placeholder="Enter category name"
              class="