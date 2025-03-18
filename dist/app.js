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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const api_router_1 = __importDefault(require("./routes/api-router"));
const app = (0, express_1.default)();
const errors_1 = require("./errors");
const connection_1 = __importDefault(require("./db/connection"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Welcome to the API!" });
});
app.get("/health", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = process.hrtime();
    const timestamp = new Date().toISOString();
    try {
        // Test database connection
        const dbResult = yield connection_1.default.query("SELECT 1 as connection_test");
        const dbConnected = dbResult && dbResult.rows && dbResult.rows.length > 0;
        // Calculate response time
        const endTime = process.hrtime(startTime);
        const responseTimeMs = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2);
        // Gather system information
        const healthData = {
            status: "ok",
            timestamp: timestamp,
            service: {
                uptime: `${Math.floor(process.uptime())} seconds`,
                environment: process.env.NODE_ENV || "development",
                memory: {
                    rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
                    heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
                    heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
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
    }
    catch (error) {
        console.error(`[${timestamp}] Health check failed:`, error);
        // Calculate response time even for errors
        const endTime = process.hrtime(startTime);
        const responseTimeMs = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2);
        res.status(500).json({
            status: "error",
            timestamp: timestamp,
            message: "Service health check failed",
            error: error instanceof Error ? error.message : "Unknown error",
            responseTime: `${responseTimeMs}ms`,
        });
    }
}));
app.use("/api", api_router_1.default);
app.use("/api/*", errors_1.inputErrorHandler);
app.use(errors_1.psqlErrorHandler);
app.use(errors_1.customErrorHandler);
app.use(errors_1.serverErrorHandler);
exports.default = app;
