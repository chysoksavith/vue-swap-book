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
// export const register = async (req: Request, res: Response) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       bio = null,
//       gender = null,
//       phone = null,
//       address = null,
//       postal_code = null,
//       country = null,
//       role = "user",
//     } = req.body;
//     // validation
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         message: "Name, email, and password are required",
//       });
//     }
//     let imageUrl = null;
//     // handle file request
//     if (req.file) {
//       const base64image = req.file.buffer.toString("base64");
//       const dataURI = `data:${req.file.mimetype};base64,${base64image}`; // Fixed semicolon spacing
//       imageUrl = await uploadToCloudinary(dataURI);
//     } else {
//       imageUrl = null;
//     }
//     // handle hash password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const sql = "SELECT id FROM users WHERE email = ?";
//     const [existingUser] = await pool.query(sql, [email]);
//     if ((existingUser as any).length > 0) {
//       return res.status(400).json({
//         message: "Email already exists",
//       });
//     }

//     // creating user
//     const sql2 = `
//     INSERT INTO users (
//       name,
//       email,
//       password,
//       bio,
//       gender,
//       phone,
//       address,
//       postal_code,
//       country,
//       profile_image,
//       role,
//       trust_score,
//       is_verified,
//       is_active,
//       created_at,
//       updated_at
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
//   `;

//     res.status(201).json({
//       message: "User created successfully",
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(400).json({
//       message: "Registration failed",
//     });
//   }
// };
export const register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      bio = null,
      gender = null,
      phone = null,
      address = null,
      postal_code = null,
      country = null,
      role = "user",
    } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    // 2. Check if email already exists
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if ((existing as any[]).length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // 3. Handle profile image (optional)
    let imageUrl: string | null = null;
    if (req.file) {
      const base64image = req.file.buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${base64image}`;
      imageUrl = await uploadToCloudinary(dataURI);
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Insert user into database
    const insertSql = `
      INSERT INTO users (
        name, email, password, bio, gender, phone, address,
        postal_code, country, profile_image, role,
        trust_score, is_verified, is_active, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const [result] = await pool.query(insertSql, [
      name,
      email,
      hashedPassword,
      bio,
      gender,
      phone,
      address,
      postal_code,
      country,
      imageUrl,
      role,
      0, // trust_score default
      false, // is_verified default
      true, // is_active default
    ]);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: (result as any).insertId,
        name,
        email,
        profile_image: imageUrl,
        role,
        is_verified: false,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
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
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      gender = "",
      is_active = "",
      date_from = "",
      date_to = "",
      sort_by = "created_at",
      sort_order = "DESC",
    } = req.query;

    // Add validation for sort_by to prevent SQL injection
    const validSortColumns = [
      "created_at",
      "name",
      "email",
      "role",
      "updated_at",
    ];
    const sortColumn = validSortColumns.includes(sort_by as string)
      ? sort_by
      : "created_at";
    const sortDirection = sort_order === "ASC" ? "ASC" : "DESC";

    // Build base query with proper spacing
    let sql = `
      SELECT 
        id, name, email, phone, address, 
        profile_image, role, gender, 
        is_active, created_at, updated_at
      FROM users
      WHERE 1=1
    `;

    // Count query with proper spacing
    let countSql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
        SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as user_count,
        SUM(CASE WHEN gender = 'male' THEN 1 ELSE 0 END) as male_count,
        SUM(CASE WHEN gender = 'female' THEN 1 ELSE 0 END) as female_count,
        SUM(CASE WHEN gender = 'other' THEN 1 ELSE 0 END) as other_count,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count,
        SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_count
      FROM users
      WHERE 1=1
    `;

    const params: any[] = [];

    // Add proper spacing in filter conditions
    if (search) {
      sql += ` AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
      countSql += ` AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (role) {
      sql += ` AND role = ?`;
      countSql += ` AND role = ?`;
      params.push(role);
    }
    if (gender) {
      sql += ` AND gender = ?`;
      countSql += ` AND gender = ?`;
      params.push(gender);
    }
    if (is_active !== "") {
      sql += ` AND is_active = ?`;
      countSql += ` AND is_active = ?`;
      params.push(is_active === "true" ? 1 : 0);
    }
    if (date_from && date_to) {
      sql += ` AND created_at BETWEEN ? AND ? `;
      countSql += ` AND created_at BETWEEN ? AND ?`;
      params.push(date_from, date_to);
    }
    // Execute count query first
    const [countResult] = await pool.query<RowDataPacket[]>(countSql, params);
    const counts = countResult[0];

    // Add sorting and pagination with proper spacing
    sql += ` ORDER BY ${sortColumn} ${sortDirection}`;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), (Number(page) - 1) * Number(limit));

    // Execute main query
    const [users] = await pool.query<UserRow[]>(sql, params);

    if (!users) {
      return res.status(404).json({
        success: false,
        message: "Users not found",
      });
    }

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total: counts.total,
        page: Number(page),
        limit: Number(limit),
        totalPage: Math.ceil(counts.total / Number(limit)),
      },
      counts: {
        byRole: {
          admin: counts.admin_count,
          user: counts.user_count,
        },
        byGender: {
          male: counts.male_count,
          female: counts.female_count,
          other: counts.other_count,
        },
        byStatus: {
          active: counts.active_count,
          inactive: counts.inactive_count,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
