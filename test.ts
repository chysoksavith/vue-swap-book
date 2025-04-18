// src/controllers/userController.ts
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Extract query parameters
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

    // Base query
    let sql = `
        SELECT 
          id, name, email, phone, address, 
          profile_image, role, gender, 
          is_active, created_at, updated_at
        FROM users
        WHERE 1=1
      `;

    // Count query for analytics
    let countSql = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
          SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as user_count,
          SUM(CASE WHEN gender = 'male' THEN 1 ELSE 0 END) as male_count,
          SUM(CASE WHEN gender = 'female' THEN 1 ELSE 0 END) as female_count,
          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count,
          SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_count
        FROM users
        WHERE 1=1
      `;

    // Filter conditions
    const params = [];

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
      sql += ` AND created_at BETWEEN ? AND ?`;
      countSql += ` AND created_at BETWEEN ? AND ?`;
      params.push(date_from, date_to);
    }

    // Execute count query
    const [countResult] = await pool.query<RowDataPacket[]>(countSql, params);
    const counts = countResult[0];

    // Add sorting and pagination
    sql += ` ORDER BY ${sort_by} ${sort_order}`;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), (Number(page) - 1) * Number(limit));

    // Execute main query
    const [users] = await pool.query<UserRow[]>(sql, params);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total: counts.total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(counts.total / Number(limit)),
      },
      counts: {
        byRole: {
          admin: counts.admin_count,
          user: counts.user_count,
        },
        byGender: {
          male: counts.male_count,
          female: counts.female_count,
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
    });
  }
};
