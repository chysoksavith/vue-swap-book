import express, { RequestHandler } from "express";
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook,
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
router.put(
  "/:id",
  bookValidationRules as RequestHandler[],
  validateResult as RequestHandler,
  updateBook as RequestHandler
);
router.delete("/:id", deleteBook as RequestHandler);
export default router;
