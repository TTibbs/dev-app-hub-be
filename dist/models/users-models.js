"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchUser = exports.insertUser = exports.selectUserById = exports.selectUsers = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const selectUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield connection_1.default.query(`
    SELECT
      u.id,
      u.username,
      u.name,
      u.email,
      u.role,
      CASE 
        WHEN u.role = 'developer' THEN (
          SELECT AVG(a.avg_rating::float8)
          FROM apps a
          WHERE a.developer_id = u.id
        )
        ELSE u.avg_rating::float8
      END AS avg_rating,
      u.created_at,
      u.updated_at,
      COALESCE(array_remove(array_agg(DISTINCT r.id), NULL), '{}') AS rating_ids,
      COALESCE(array_remove(array_agg(DISTINCT i.id), NULL), '{}') AS issue_ids,
      COALESCE(array_remove(array_agg(DISTINCT c.id), NULL), '{}') AS comment_ids
    FROM users u
    LEFT JOIN ratings r ON r.author_id = u.id
    LEFT JOIN issues i ON i.author_id = u.id
    LEFT JOIN comments c ON c.author_id = u.id
    GROUP BY
      u.id,
      u.username,
      u.name,
      u.email,
      u.role,
      u.avg_rating,
      u.created_at,
      u.updated_at
    ORDER BY u.created_at DESC;
  `);
    return result.rows;
});
exports.selectUsers = selectUsers;
const selectUserById = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield connection_1.default.query(`
    SELECT
      u.id,
      u.username,
      u.name,
      u.email,
      u.role,
      CASE 
        WHEN u.role = 'developer' THEN (
          SELECT AVG(a.avg_rating::float8)
          FROM apps a
          WHERE a.developer_id = u.id
        )
        ELSE u.avg_rating::float8
      END AS avg_rating,
      u.created_at,
      u.updated_at,
      (
        SELECT COALESCE(array_remove(array_agg(DISTINCT a.id), NULL), '{}')
        FROM apps a
        WHERE a.developer_id = u.id
      ) AS app_ids,
      (
        SELECT COALESCE(array_remove(array_agg(DISTINCT r.id), NULL), '{}')
        FROM ratings r
        WHERE r.author_id = u.id
      ) AS rating_ids,
      (
        SELECT COALESCE(array_remove(array_agg(DISTINCT i.id), NULL), '{}')
        FROM issues i
        WHERE i.author_id = u.id
      ) AS issue_ids,
      (
        SELECT COALESCE(array_remove(array_agg(DISTINCT c.id), NULL), '{}')
        FROM comments c
        WHERE c.author_id = u.id
      ) AS comment_ids
    FROM users u
    WHERE u.id = $1
  `, [user_id]);
    if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
    }
    return result.rows[0];
});
exports.selectUserById = selectUserById;
const insertUser = (username, name, email, role, password, avg_rating) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield connection_1.default.query(`INSERT INTO users (username, name, email, role, password, avg_rating) VALUES ($1, $2, $3, $4, $5, $6::numeric) RETURNING 
      id, 
      username, 
      name, 
      email, 
      role, 
      avg_rating::float8 AS avg_rating, 
      created_at, 
      updated_at`, [username, name, email, role, password, avg_rating]);
    return result.rows[0];
});
exports.insertUser = insertUser;
const patchUser = (user_id, username, name, email, role, password, avg_rating) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = [];
    const values = [];
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
        updates.push(`avg_rating = ($${valueIndex++})::numeric`);
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
    RETURNING 
      id, 
      username, 
      name, 
      email, 
      role, 
      avg_rating::float8 AS avg_rating, 
      created_at, 
      updated_at
  `;
    const result = yield connection_1.default.query(query, values);
    if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
    }
    return result.rows[0];
});
exports.patchUser = patchUser;
