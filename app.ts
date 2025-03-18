import express from "express";
import cors from "cors";
import apiRouter from "./routes/api-router";
import healthRouter from "./routes/health-router";
const app = express();
import {
  inputErrorHandler,
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} from "./errors";

app.use(cors());
app.use(express.json());

app.use("/", (req, res) => {
  res.status(200).json({ msg: "Welcome to the API!" });
});

app.use("/api", apiRouter);
app.use("/health", healthRouter);
app.use("/api/*", inputErrorHandler);
app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

export default app;
