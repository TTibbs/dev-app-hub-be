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
    SELECT * FROM users
    ORDER BY created_at DESC
  `);
    return result.rows;
});
exports.selectUsers = selectUsers;
const selectUserById = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield connection_1.default.query(`
    SELECT users.id, users.username, users.name, users.email, users.role, users.avg_rating, users.created_at, users.updated_at,
    COALESCE(JSON_AGG(apps.id) FILTER (WHERE apps.id IS NOT NULL), '[]') AS app_ids,
    COALESCE(JSON_AGG(comments.id) FILTER (WHERE comments.id IS NOT NULL), '[]') AS comment_ids
    FROM users
    LEFT JOIN apps ON users.id = apps.developer_id
    LEFT JOIN comments ON users.id = comments.author_id
    WHERE users.id = $1
    GROUP BY users.id
  `, [user_id]);
    if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
    }
    return result.rows[0];
});
exports.selectUserById = selectUserById;
const insertUser = (username, name, email, role, password, avg_rating) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield connection_1.default.query(`INSERT INTO users (username, name, email, role, password, avg_rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [username, name, email, role, password, avg_rating]);
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
    const result = yield connection_1.default.query(query, values);
    if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
    }
    return result.rows[0];
});
exports.patchUser = patchUser;
