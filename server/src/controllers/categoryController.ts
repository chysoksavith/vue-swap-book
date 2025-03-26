import { Request, Response } from "express";
import pool from "../config/db";
import { Category } from "../models/Category";
import { RowDataPacket } from "mysql2";

interface CategoryRow extends Category, RowDataPacket {}

// get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const [categories] = await pool.query<CategoryRow[]>(
      "SELECT id, name, published , created_at, updated_at FROM categories ORDER BY created_at DESC"
    );
    if (!categories || categories.length === 0 || !Array.isArray(categories)) {
      return res.status(404).json({
        message: "No categories found",
      });
    }
    res.status(200).json({
      categories: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// get category by id
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [categories] = await pool.query<CategoryRow[]>(
      "SELECT id, name, published FROM categories WHERE id = ?",
      [id]
    );
    if (!categories || categories.length === 0 || !Array.isArray(categories)) {
      return res.status(404).json({
        message: "No categories found",
      });
    }
    res.status(200).json({
      success: true,
      categories: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
// create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, published = true } = req.body;
    // validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      {
        return res.status(400).json({
          success: false,
          message: "Category name must be at least 2 characters long",
        });
      }
    }
    // check if category already exists
    const [existingCategory] = await pool.query<CategoryRow[]>(
      "SELECT id FROM categories WHERE name = ?",
      [name.trim()]
    );
    if (existingCategory && existingCategory.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }
    // create category
    const [newCategory] = await pool.query<CategoryRow[]>(
      "INSERT INTO categories (name, published) VALUES (?,?)",
      [name.trim(), published]
    );
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
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
    const { name, published } = req.body;

    // validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Category name must be at least 2 characters long",
      });
    }
    // check if category exists
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
    // check if name already exists
    const [duplicateName] = await pool.query<CategoryRow[]>(
      "SELECT id FROM categories WHERE  name = ? AND id != ?",
      [name.trim(), id]
    );
    if (duplicateName && duplicateName.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists",
      });
    }
    // update category
    await pool.query<CategoryRow[]>(
      "UPDATE categories SET name = ? , published = ? WHERE id = ?",
      [name.trim(), published, id]
    );
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updateCategory,
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
