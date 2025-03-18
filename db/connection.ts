import { Pool } from "pg";
import { PoolConfig } from "./types";
import path from "path";
import fs from "fs";
const ENV = process.env.NODE_ENV || "development";

if (!ENV) {
  throw new Error("NODE_ENV is not set");
}

// Check if we're running from the dist folder
const envPath = fs.existsSync(path.join(__dirname, `../.env.${ENV}`))
  ? path.join(__dirname, `../.env.${ENV}`) // When running from dist
  : path.join(__dirname, `/../.env.${ENV}`); // When running from root

require("dotenv").config({
  path: envPath,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PG database or database URL not set");
}

const config: PoolConfig = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL as string;
  config.max = 2;
}

export default new Pool(config as any);
