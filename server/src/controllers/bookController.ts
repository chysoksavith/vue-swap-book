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
  } catch (error) {}
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
