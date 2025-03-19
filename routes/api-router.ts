import { Router, Request, Response } from "express";
const apiRouter = Router();
import usersRouter from "./users-router";
import appsRouter from "./apps-router";
import endpoints from "../endpoints.json";

apiRouter.get("/", (req: Request, res: Response) => {
  res.status(200).send({ endpoints });
});

apiRouter.use("/users", usersRouter);
apiRouter.use("/apps", appsRouter);

export default apiRouter;
