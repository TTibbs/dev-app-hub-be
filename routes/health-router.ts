const healthRouter = require("express").Router();
import { getHealthCheck } from "../controllers/health-controller";

healthRouter.get("/", getHealthCheck);

export default healthRouter;
