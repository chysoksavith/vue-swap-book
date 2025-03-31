import { Router, RequestHandler } from "express";
import { register, login } from "../controllers/userController";
import upload from "../middlewares/uploadMiddleware";

const router = Router();

router.post(
  "/register",
  upload.single("profile_image"),
  register as RequestHandler
);
router.post("/login", login as RequestHandler);

export default router;
