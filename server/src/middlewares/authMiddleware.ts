import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Invalid authorization header format",
      });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ status: "error", message: "Access denied, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    // check token expiration
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return res
        .status(401)
        .json({ status: "error", message: "Token has expired" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    }
    res.status(400).json({
      status: "error",
      message: "Authentication failed",
    });
  }
};

// role permissions
export const checkRole = (allowedRole: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      if (!allowedRole.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied. Insufficient permissions",
        });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
};
