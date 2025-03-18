"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiRouter = (0, express_1.Router)();
const users_router_1 = __importDefault(require("./users-router"));
const endpoints_json_1 = __importDefault(require("../endpoints.json"));
apiRouter.get("/", (req, res) => {
    res.status(200).send({ endpoints: endpoints_json_1.default });
});
apiRouter.use("/users", users_router_1.default);
exports.default = apiRouter;
