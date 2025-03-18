"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const api_router_1 = __importDefault(require("./routes/api-router"));
const app = (0, express_1.default)();
const errors_1 = require("./errors");
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", api_router_1.default);
app.use("/api/*", errors_1.inputErrorHandler);
app.use(errors_1.psqlErrorHandler);
app.use(errors_1.customErrorHandler);
app.use(errors_1.serverErrorHandler);
exports.default = app;
