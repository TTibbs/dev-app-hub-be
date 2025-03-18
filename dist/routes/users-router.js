"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usersRouter = require("express").Router();
const users_controller_1 = require("../controllers/users-controller");
usersRouter.get("/", users_controller_1.getUsers);
usersRouter.get("/:user_id", users_controller_1.getUserById);
usersRouter.post("/", users_controller_1.createUser);
usersRouter.patch("/:user_id", users_controller_1.updateUser);
exports.default = usersRouter;
