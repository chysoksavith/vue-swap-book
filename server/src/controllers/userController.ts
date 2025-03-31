import { Request, Response } from "express";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import bcrypt from "bcryptjs";
import pool from "../config/db";
import jwt from "jsonwebtoken";

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
      { id: user.id, email: user.email, role: user.role },

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
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
};
