import { Response, Request, NextFunction } from "express";
import pool from "../config/db";
import { extractToken } from "../utils/token";

export const checkBlackListedToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token || token.length < 10) {
      return res.status(401).json({ message: "Invalid or missing token" });
    }

    const [result] = await pool.query(
      "SELECT id FROM token_blacklist WHERE token = ? AND expired_at > NOW()",
      [token]
    );

    if ((result as any).length > 0) {
      return res.status(401).json({ message: "Token has been invalidated" });
    }

    next();
  } catch (error) {
    console.error("Token check error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
