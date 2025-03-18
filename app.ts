import express from "express";
import cors from "cors";
import apiRouter from "./routes/api-router";
import { Request, Response } from "express";
const app = express();
import {
  inputErrorHandler,
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} from "./errors";
import pool from "./db/connection";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Welcome to the API!" });
});

app.get("/health", async (req: Request, res: Response) => {
  const startTime = process.hrtime();
  const timestamp = new Date().toISOString();

  try {
    // Test database connection
    const dbResult = await pool.query("SELECT 1 as connection_test");
    const dbConnected = dbResult && dbResult.rows && dbResult.rows.length > 0;

    // Calculate response time
    const endTime = process.hrtime(startTime);
    const responseTimeMs = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(
      2
    );

    // Gather system information
    const healthData = {
      status: "ok",
      timestamp: timestamp,
      service: {
        uptime: `${Math.floor(process.uptime())} seconds`,
        environment: process.env.NODE_ENV || "development",
        memory: {
          rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(
            process.memoryUsage().heapTotal / 1024 / 1024
          )} MB`,
          heapUsed: `${Math.round(
            process.memoryUsage().heapUsed / 1024 / 1024
          )} MB`,
        },
      },
      database: {
        connected: dbConnected,
        connectionPool: {
          status: "connected",
        },
      },
      responseTime: `${responseTimeMs}ms`,
    };
    res.status(200).json(healthData);
  } catch (error) {
    console.error(`[${timestamp}] Health check failed:`, error);

    // Calculate response time even for errors
    const endTime = process.hrtime(startTime);
    const responseTimeMs = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(
      2
    );

    res.status(500).json({
      status: "error",
      timestamp: timestamp,
      message: "Service health check failed",
      error: error instanceof Error ? error.message : "Unknown error",
      responseTime: `${responseTimeMs}ms`,
    });
  }
});

app.use("/api", apiRouter);
app.use("/api/*", inputErrorHandler);
app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

export default app;
