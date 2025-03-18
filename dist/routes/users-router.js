"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usersRouter = require("express").Router();
const users_controller_1 = require("../controllers/users-controller");
usersRouter.get("/", users_controller_1.getUsers);
exports.default = usersRouter;
