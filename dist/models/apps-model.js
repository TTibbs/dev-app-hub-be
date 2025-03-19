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
exports.deleteAppById = exports.updateAppById = exports.insertApp = exports.selectAppComments = exports.selectAppById = exports.selectApps = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const selectApps = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield connection_1.default.query(`
    SELECT
        a.id,
        a.name,
        a.description,
        a.category,
        a.app_url,
        a.app_img_url,
        a.avg_rating::float8 AS avg_rating,
        a.developer_id,
        a.created_at,
        a.updated_at,
        COALESCE(array_remove(array_agg(DISTINCT i.id), NULL), '{}') AS issue_ids,
        COALESCE(array_remove(array_agg(DISTINCT c.id), NULL), '{}') AS comment_ids,
        COALESCE(array_remove(array_agg(DISTINCT r.id), NULL), '{}') AS rating_ids
    FROM apps a
    LEFT JOIN issues i ON i.app_id = a.id
    LEFT JOIN comments c ON c.app_id = a.id
    LEFT JOIN ratings r ON r.app_id = a.id
    GROUP BY a.id;
    `);
    if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No apps found" });
    }
    return result.rows;
});
exports.selectApps = selectApps;
const selectAppById = (app_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield connection_1.default.query(`
    SELECT 
      a.id, 
      a.name, 
      a.description,
      a.category,
      a.app_url, 
      a.app_img_url, 
      a.avg_rating::float8 AS avg_rating, 
      a.developer_id, 
      a.created_at, 
      a.updated_at,
      COALESCE(array_remove(array_agg(DISTINCT i.id), NULL), '{}') AS issue_ids,
      COALESCE(array_remove(array_agg(DISTINCT c.id), NULL), '{}') AS comment_ids,
      COALESCE(array_remove(array_agg(DISTINCT r.id), NULL), '{}') AS rating_ids
    FROM apps a
    LEFT JOIN issues i ON i.app_id = a.id
    LEFT JOIN comments c ON c.app_id = a.id
    LEFT JOIN ratings r ON r.app_id = a.id
    WHERE a.id = $1
    GROUP BY 
      a.id, 
      a.name, 
      a.description,
      a.category,
      a.app_url, 
      a.app_img_url, 
      a.avg_rating, 
      a.developer_id, 
      a.created_at, 
      a.updated_at;
    `, [app_id]);
    if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "App not found" });
    }
    return result.rows[0];
});
exports.selectAppById = selectAppById;
const selectAppComments = (app_id) => __awaiter(void 0, void 0, void 0, function* () {
    // First check if the app exists
    const appCheck = yield connection_1.default.query("SELECT id FROM apps WHERE id = $1", [
        app_id,
    ]);
    if (appCheck.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "App not found" });
    }
    const result = yield connection_1.default.query(`
    SELECT 
      c.id,
      c.body,
      c.votes,
      c.author_id,
      c.created_at,
      c.updated_at,
      u.username as author_username
    FROM comments c
    JOIN users u ON c.author_id = u.id
    WHERE c.app_id = $1
    ORDER BY c.created_at DESC;
    `, [app_id]);
    // Return the comments array, which may be empty
    return result.rows;
});
exports.selectAppComments = selectAppComments;
const insertApp = (name, description, category, app_url, app_img_url, developer_id, avg_rating) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield connection_1.default.query(`
    WITH inserted_app AS (
      INSERT INTO apps (name, description, category, app_url, app_img_url, developer_id, avg_rating)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    )
    SELECT 
      a.id, 
      a.name, 
      a.description, 
      a.category,
      a.app_url, 
      a.app_img_url, 
      a.avg_rating::float8 AS avg_rating, 
      a.developer_id, 
      a.created_at, 
      a.updated_at,
      COALESCE(array_remove(array_agg(DISTINCT i.id), NULL), '{}') AS issue_ids,
      COALESCE(array_remove(array_agg(DISTINCT c.id), NULL), '{}') AS comment_ids,
      COALESCE(array_remove(array_agg(DISTINCT r.id), NULL), '{}') AS rating_ids
    FROM inserted_app a
    LEFT JOIN issues i ON i.app_id = a.id
    LEFT JOIN comments c ON c.app_id = a.id
    LEFT JOIN ratings r ON r.app_id = a.id
    GROUP BY 
      a.id, 
      a.name, 
      a.description, 
      a.category,
      a.app_url, 
      a.app_img_url, 
      a.avg_rating, 
      a.developer_id, 
      a.created_at, 
      a.updated_at;
    `, [
        name,
        description,
        category,
        app_url,
        app_img_url,
        developer_id,
        avg_rating || null,
    ]);
    return result.rows[0];
});
exports.insertApp = insertApp;
const updateAppById = (app_id, name, description, category, app_url, app_img_url, developer_id, avg_rating) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield connection_1.default.query(`
    UPDATE apps
    SET name = $1, description = $2, category = $3, app_url = $4, app_img_url = $5, developer_id = $6, avg_rating = $7
    WHERE id = $8
    RETURNING *;
    `, [
        name,
        description,
        category,
        app_url,
        app_img_url,
        developer_id,
        avg_rating,
        app_id,
    ]);
    return result.rows[0];
});
exports.updateAppById = updateAppById;
const deleteAppById = (app_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield connection_1.default.query(`DELETE FROM apps WHERE id = $1 RETURNING *`, [
        app_id,
    ]);
    if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "App not found" });
    }
    return result.rows[0];
});
exports.deleteAppById = deleteAppById;
