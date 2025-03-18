const usersRouter = require("express").Router();
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
} from "../controllers/users-controller";

usersRouter.get("/", getUsers);
usersRouter.get("/:user_id", getUserById);
usersRouter.post("/", createUser);
usersRouter.patch("/:user_id", updateUser);

export default usersRouter;
