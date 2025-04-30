import express, { RequestHandler } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController";
import { categoryValidationRules } from "../middlewares/categoryValidation";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

router.get(
  "/",
  authenticateUser as RequestHandler,
  getCategories as RequestHandler
);
router.get(
  "/:id",
  authenticateUser as RequestHandler,
  getCategoryById as RequestHandler
);
router.post(
  "/",
  authenticateUser as RequestHandler,
  categoryValidationRules as RequestHandler[],
  createCategory as RequestHandler
);
router.put(
  "/:id",
  authenticateUser as RequestHandler,
  updateCategory as RequestHandler
);
router.delete(
  "/:id",
  authenticateUser as RequestHandler,
  deleteCategory as RequestHandler
);
export default router;
