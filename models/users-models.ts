import db from "../db/connection";
import { User } from "../db/types";

export const selectUsers = async (): Promise<User[]> => {
  const result = await db.query(`
    SELECT * FROM users
    ORDER BY created_at DESC
  `);
  return result.rows as User[];
};

export const selectUserById = async (user_id: number): Promise<User> => {
  const result = await db.query(
    `
    SELECT users.id, users.username, users.name, users.email, users.role, users.avg_rating, users.created_at, users.updated_at,
    COALESCE(JSON_AGG(apps.id) FILTER (WHERE apps.id IS NOT NULL), '[]') AS app_ids,
    COALESCE(JSON_AGG(comments.id) FILTER (WHERE comments.id IS NOT NULL), '[]') AS comment_ids
    FROM users
    LEFT JOIN apps ON users.id = apps.developer_id
    LEFT JOIN comments ON users.id = comments.author_id
    WHERE users.id = $1
    GROUP BY users.id
  `,
    [user_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "User not found" });
  }
  return result.rows[0] as User;
};

export const insertUser = async (
  username: string,
  name: string,
  email: string,
  role: string,
  password: string,
  avg_rating: number
): Promise<User> => {
  const result = await db.query(
    `INSERT INTO users (username, name, email, role, password, avg_rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [username, name, email, role, password, avg_rating]
  );
  return result.rows[0] as User;
};

export const patchUser = async (
  user_id: number,
  username?: string,
  name?: string,
  email?: string,
  role?: string,
  password?: string,
  avg_rating?: number
): Promise<User> => {
  const updates: string[] = [];
  const values: any[] = [];
  let valueIndex = 1;

  if (username !== undefined) {
    updates.push(`username = $${valueIndex++}`);
    values.push(username);
  }
  if (name !== undefined) {
    updates.push(`name = $${valueIndex++}`);
    values.push(name);
  }
  if (email !== undefined) {
    updates.push(`email = $${valueIndex++}`);
    values.push(email);
  }
  if (role !== undefined) {
    updates.push(`role = $${valueIndex++}`);
    values.push(role);
  }
  if (password !== undefined) {
    updates.push(`password = $${valueIndex++}`);
    values.push(password);
  }
  if (avg_rating !== undefined) {
    updates.push(`avg_rating = $${valueIndex++}`);
    values.push(avg_rating);
  }

  if (updates.length === 0) {
    return Promise.reject({ status: 400, msg: "No fields to update" });
  }

  values.push(user_id);

  const query = `
    UPDATE users
    SET ${updates.join(", ")}
    WHERE id = $${valueIndex}
    RETURNING *
  `;

  const result = await db.query(query, values);

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "User not found" });
  }

  return result.rows[0] as User;
};
