import { Router, RequestHandler } from "express";
import {
  register,
  login,
  logout,
  getProfile,
} from "../controllers/userController";
import upload from "../middlewares/uploadMiddleware";
import { checkBlackListedToken } from "../middlewares/checkBlacklistedToken";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/register",
  upload.single("profile_image"),
  register as RequestHandler
);
router.post("/login", login as RequestHandler);
router.post(
  "/logout",
  authenticateUser as RequestHandler,
  logout as unknown as RequestHandler
);
router.get(
  "/profile",
  authenticateUser as RequestHandler,
  getProfile as unknown as RequestHandler
);
export default router;
