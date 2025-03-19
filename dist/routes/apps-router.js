"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appsRouter = (0, express_1.Router)();
const apps_controller_1 = require("../controllers/apps-controller");
appsRouter.get("/", apps_controller_1.getApps);
appsRouter.get("/:app_id", apps_controller_1.getAppById);
appsRouter.get("/:app_id/comments", apps_controller_1.getCommentsByAppId);
appsRouter.post("/", apps_controller_1.createApp);
appsRouter.patch("/:app_id", apps_controller_1.updateApp);
appsRouter.delete("/:app_id", apps_controller_1.deleteApp);
exports.default = appsRouter;
