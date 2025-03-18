"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ENV = process.env.NODE_ENV || "development";
if (!ENV) {
    throw new Error("NODE_ENV is not set");
}
// Check if we're running from the dist folder
const envPath = fs_1.default.existsSync(path_1.default.join(__dirname, `../.env.${ENV}`))
    ? path_1.default.join(__dirname, `../.env.${ENV}`) // When running from dist
    : path_1.default.join(__dirname, `/../.env.${ENV}`); // When running from root
require("dotenv").config({
    path: envPath,
});
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PG database or database URL not set");
}
const config = {};
if (ENV === "production") {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 2;
}
exports.default = new pg_1.Pool(config);
