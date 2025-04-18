import { Request, Response } from "express";
import pool from "../config/db";
import { Book } from "../models/Book";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface BookRow extends Book, RowDataPacket {}

// get all book
export const getBooks = async (req: Request, res: Response) => {
  try {
    const [books] = await pool.query<BookRow[]>(
      `SELECT books.*, categories.name as category_name
                FROM books
                LEFT JOIN categories ON books.category_id
                = categories.id
                ORDER BY created_at DESC`
    );
    if (!books || books.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No books found",
      });
    }
    res.status(200).json({
      success: true,
      books: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
    });
  }
};
// get book by id
export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [books] = await pool.query<BookRow[]>(
      `SELECT books.*, categories.name as 
            category_name
                FROM books
                LEFT JOIN categories on books.category_id
                = categories.id
                WHERE books.id = ?`,
      [id]
    );
    if (!books || books.length === 0) {
      {
        return res.status(400).json({
          success: false,
          message: "Book not found",
        });
      }
    }
    res.status(200).json({
      success: true,
      book: books[0],
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch book",
    });
  }
};
// create book
export const createBook = async (req: Request, res: Response) => {
  try {
    const {
      user_id, // Add this back as it's needed
      title,
      author,
      description,
      category_id,
      condition_book,
      image = null,
    } = req.body;
    // validation check category existing
    const [category] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM categories WHERE id = ? ",
      [category_id]
    );
    if (!category || category.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO books (
            user_id, title, author, description, category_id, 
            condition_book, image, is_approved, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, false, 'available')`,
      [user_id, title, author, description, category_id, condition_book, image]
    );
    const [newBook] = await pool.query<BookRow[]>(
      "SELECT * FROM books WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book: newBook[0],
    });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create book",
    });
  }
};
// update book
export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      description,
      category_id,
      condition_book,
      image = null,
    } = req.body;

    // validation check book existing
    const [existingBook] = await pool.query<BookRow[]>(
      "SELECT * FROM books WHERE id = ?",
      [id]
    );

    if (!existingBook || existingBook.length === 0) {
      return res.status(404).json({
        // Changed to 404 status
        success: false,
        message: "Book not found",
      });
    }

    // validation check category existing
    const [category] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM categories WHERE id = ?",
      [category_id]
    );

    if (!category || category.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    // update book - fixed query formatting
    await pool.query(
      "UPDATE books SET title = ?, author = ?, description = ?, category_id = ?, condition_book = ?, image = ? WHERE id = ?",
      [title, author, description, category_id, condition_book, image, id]
    );

    // Get updated book with category info
    const [updatedBook] = await pool.query<BookRow[]>(
      `SELECT books.*, categories.name as category_name
       FROM books
       LEFT JOIN categories ON books.category_id = categories.id
       WHERE books.id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook[0],
    });
  } catch (error) {
    console.error("Error updating book:", error); // Added error logging
    res.status(500).json({
      success: false,
      message: "Failed to update book",
    });
  }
};
// delete book
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [existingBook] = await pool.query<BookRow[]>(
      "SELECT * FROM books WHERE id = ? ",
      [id]
    );
    if (!existingBook || existingBook.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    await pool.query("DELETE FROM books WHERE id = ?", [id]);
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete book",
    });
  }
};
