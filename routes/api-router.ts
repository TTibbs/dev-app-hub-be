import express from "express";
const apiRouter = express.Router();
import usersRouter from "./users-router";
import endpoints from "../endpoints.json";

apiRouter.get("/", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

apiRouter.use("/users", usersRouter);

export default apiRouter;
