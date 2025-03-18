import { Router, Request, Response } from "express";
const apiRouter = Router();
import usersRouter from "./users-router";
import endpoints from "../endpoints.json";

apiRouter.get("/", (req: Request, res: Response) => {
  res.status(200).send({ endpoints });
});

apiRouter.use("/users", usersRouter);

export default apiRouter;
