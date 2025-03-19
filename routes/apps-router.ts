import { Router } from "express";
const appsRouter = Router();
import {
  getApps,
  getAppById,
  createApp,
  updateApp,
  deleteApp,
  getCommentsByAppId,
} from "../controllers/apps-controller";

appsRouter.get("/", getApps);
appsRouter.get("/:app_id", getAppById);
appsRouter.get("/:app_id/comments", getCommentsByAppId);
appsRouter.post("/", createApp);
appsRouter.patch("/:app_id", updateApp);
appsRouter.delete("/:app_id", deleteApp);

export default appsRouter;
