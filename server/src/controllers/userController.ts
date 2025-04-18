import { Request, Response } from "express";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import bcrypt from "bcryptjs";
import pool from "../config/db";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import { User } from "../models/User";
declare module "express" {
  interface Request {
    user?: {
      id: number;
      email: string;
      role: string;
    };
  }
}
interface UserRow extends User, RowDataPacket {}
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, address, role } = req.body;
    let imageUrl = null;
    // handle file request
    if (req.file) {
      const base64image = req.file.buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${base64image}`; // Fixed semicolon spacing
      imageUrl = await uploadToCloudinary(dataURI);
    } else {
      imageUrl = null;
    }
    // handle hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "SELECT id FROM users WHERE email = ?";
    const [existingUser] = await pool.query(sql, [email]);
    if ((existingUser as any).length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    // creating user
    const sql2 =
      "INSERT INTO users (name, email, password, phone, address, profile_image, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
    await pool.query(sql2, [
      name,
      email,
      hashedPassword,
      phone,
      address,
      imageUrl,
      role || "user",
    ]);
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      message: "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if ((users as any).length === 0) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const user = (users as any)[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    // check if jwt secret exists
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      {
        return res.status(500).json({
          message: "Server configuration error",
        });
      }
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone || null,
        address: user.address || null,
        profile_image: user.profile_image || null,
      },

      jwtSecret,
      {
        expiresIn: "10h",
      }
    );

    // send response with token
    res.status(200).json({
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || null,
        address: user.address || null,
        profile_image: user.profile_image || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed. Please try again later.",
    });
  }
};
// get profile user
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const [users] = await pool.query<RowDataPacket[]>(
      `SELECT 
        id, 
        name, 
        email, 
        COALESCE(phone, '') as phone,
        COALESCE(address, '') as address,
        profile_image, 
        role, 
        created_at
      FROM users 
      WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json(users[0]);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const sql =
      "SELECT name, email, phone, address, profile_image ,role, created_at, updated_at FROM users";
    const [users] = await pool.query<UserRow[]>(sql);
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Users not found",
      });
    }
    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
