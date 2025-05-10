import { Request, Response } from "express";
import pool from "../config/db";
import { Category } from "../models/Category";
import { RowDataPacket } from "mysql2";
import { buildCategoryTree } from "../helpers/buildCategoryTree";
import { generateSlug } from "../utils/slug";
interface CategoryRow extends Category, RowDataPacket {}

// get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    // Parse query parameters with defaults
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const format = (req.query.format as string) || "flat";

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Base query
    let query = `
      SELECT id, name, published, created_at, updated_at, slug, parent_id 
      FROM categories 
      WHERE name LIKE ?
    `;

    // Parameters for the query
    const queryParams: any[] = [`%${search}%`];

    // Add ordering
    query += ` ORDER BY parent_id IS NOT NULL, name ASC`;

    // Get total count for pagination
    const [totalCountResult] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM categories WHERE name LIKE ?`,
      [`%${search}%`]
    );
    const totalCount = (totalCountResult[0] as RowDataPacket).count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Add pagination to the main query
    query += ` LIMIT ? OFFSET ?`;
    // Push as numbers, not strings
    queryParams.push(limit, offset);

    // Execute the query
    const [categories] = await pool.query<CategoryRow[]>(query, queryParams);

    if (!categories || !Array.isArray(categories)) {
      return res.status(404).json({
        message: "No categories found",
      });
    }

    // Prepare response data
    const responseData: any = {
      success: true,
      data: format === "tree" ? buildCategoryTree(categories) : categories,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// get category by id
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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
    // get child categories if any
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
      categories: categoryWithChildren,
    });
  } catch (error) {
    console.log("get categ id", error);
    res.status(500).json({
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
    // generate slug
    const slug = generateSlug(name);

    // check if category already exists
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
    // if parent_id provided verify parent exists
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
    // generate slug
    const slug = generateSlug(name);

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

    // check if name already exists
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
    // check if category has children
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
    const [usedInBook] = await pool.query<CategoryRow[]>(
      "SELECT id FROM books WHERE category_id = ? LIMIT 1",
      [id]
    );
    if (usedInBook && (usedInBook as any[]).length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete category that is being used in books. Please reassign or delete the books first.",
      });
    }
    // detelet category
    await pool.query<CategoryRow[]>("DELETE FROM categories WHERE id = ?", [
      id,
    ]);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};
// update category status
export const updateCategoryStatus = async (req: Request, res: Response) => {
  try {
    const cateId = req.params.id;
    const { published } = req.body;

    if (typeof published !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid published status",
      });
    }
    const [result] = await pool.query(
      "UPDATE categories SET published = ?, updated_at = NOW() WHERE id = ?",
      [published, cateId]
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
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
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
