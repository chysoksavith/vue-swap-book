import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const categoryValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage("Name must contain only letters, numbers, and spaces"),
  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean value"),
  body("parent_id")
    .optional({ nullable: true })
    .isInt()
    .withMessage("Parent ID must be an integer"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
