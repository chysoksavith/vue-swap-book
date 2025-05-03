import express, { RequestHandler } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getCategoryPath,
  updateCategory,
  updateCategoryStatus,
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
router.get(
  "/:id/path",
  authenticateUser as RequestHandler,
  getCategoryPath as RequestHandler
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
router.patch(
  "/:id/status",
  authenticateUser as RequestHandler,
  updateCategoryStatus as unknown as RequestHandler
);
export default router;
