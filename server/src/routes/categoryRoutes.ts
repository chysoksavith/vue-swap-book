import express, { RequestHandler } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController";
import { categoryValidationRules } from "../middlewares/categoryValidation";

const router = express.Router();

router.get("/", getCategories as RequestHandler);
router.get("/:id", getCategoryById as RequestHandler);
router.post(
  "/",
  categoryValidationRules as RequestHandler[],
  createCategory as RequestHandler
);
router.put("/:id", updateCategory as RequestHandler);
router.delete("/:id", deleteCategory as RequestHandler);
export default router;
