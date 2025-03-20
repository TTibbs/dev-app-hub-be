import { Router, Request, Response } from "express";
const apiRouter = Router();
import endpoints from "../endpoints.json";
import usersRouter from "./users-router";
import appsRouter from "./apps-router";
import commentsRouter from "./comments-router";

apiRouter.get("/", (req: Request, res: Response) => {
  res.status(200).send({ endpoints });
});

apiRouter.use("/users", usersRouter);
apiRouter.use("/apps", appsRouter);
apiRouter.use("/comments", commentsRouter);

export default apiRouter;
