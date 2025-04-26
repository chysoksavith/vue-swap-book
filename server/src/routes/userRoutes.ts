import { Router, RequestHandler } from "express";
import {
  register,
  login,
  logout,
  getProfile,
  getAllUsers,
  updateUserStatus,
  changePasswordUser,
} from "../controllers/userController";
import upload from "../middlewares/uploadMiddleware";
import { checkBlackListedToken } from "../middlewares/checkBlacklistedToken";
import { authenticateUser, checkRole } from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/register",
  upload.single("profile_image"),
  register as unknown as RequestHandler
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
  checkRole(["admin"]) as RequestHandler,
  getProfile as unknown as RequestHandler
);
router.get(
  "/",
  authenticateUser as RequestHandler,
  checkRole(["admin"]) as RequestHandler,
  getAllUsers as RequestHandler
);
router.patch(
  "/:id/status",
  authenticateUser as RequestHandler,
  checkRole(["admin"]) as RequestHandler,
  updateUserStatus as unknown as RequestHandler
);
router.patch(
  "/change-password",
  authenticateUser as RequestHandler,
  changePasswordUser as unknown as RequestHandler
);
// router.get(
//   "/validate-token",
//   authenticateUser as RequestHandler,
//   (req, res) => {
//     res.status(200).json({ valid: true });
//   }
// );
export default router;
