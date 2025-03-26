import { body } from "express-validator";
import { validateResult } from "./validateResult";

export const bookValidationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),

  body("author")
    .trim()
    .notEmpty()
    .withMessage("Author is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Author must be between 2 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("category_id")
    .notEmpty()
    .withMessage("Category is required")
    .isInt()
    .withMessage("Invalid category"),

  body("condition_book")
    .notEmpty()
    .withMessage("Book condition is required")
    .isIn(["New", "Good", "Used"])
    .withMessage("Invalid book condition"),

  body("image").optional().isString().withMessage("Image must be a string"),
  validateResult,
];
