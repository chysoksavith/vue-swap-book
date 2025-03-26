import express, { RequestHandler } from "express";
import {
  createBook,
  getBookById,
  getBooks,
} from "../controllers/bookController";
import { bookValidationRules } from "../middlewares/bookValidation";
import { validateResult } from "../middlewares/validateResult";
const router = express.Router();

router.get("/", getBooks as RequestHandler);
router.get("/:id", getBookById as RequestHandler);
router.post(
  "/",
  bookValidationRules as RequestHandler[],
  validateResult as RequestHandler,
  createBook as RequestHandler
);

export default router;
