"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const users_models_1 = require("../models/users-models");
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, users_models_1.selectUsers)();
        res.status(200).send({ users });
    }
    catch (err) {
        next(err);
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        if (isNaN(Number(user_id))) {
            return res.status(400).send({ msg: "Invalid user_id" });
        }
        const user = yield (0, users_models_1.selectUserById)(Number(user_id));
        res.status(200).send({ user });
    }
    catch (err) {
        next(err);
    }
});
exports.getUserById = getUserById;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, name, email, role, password, avg_rating } = req.body;
        if (!username || !name || !email || !role || !password) {
            return res.status(400).send({ msg: "Missing required fields" });
        }
        const user = yield (0, users_models_1.insertUser)(username, name, email, role, password, avg_rating);
        res.status(201).send({ user });
    }
    catch (err) {
        next(err);
    }
});
exports.createUser = createUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        if (isNaN(Number(user_id))) {
            return res.status(400).send({ msg: "Invalid user_id" });
        }
        yield (0, users_models_1.selectUserById)(Number(user_id));
        const { username, name, email, role, password, avg_rating } = req.body;
        // if (!username && !name && !email && !role && !password && !avg_rating) {
        //   return res.status(400).send({ msg: "No fields to update" });
        // }
        const updatedUser = yield (0, users_models_1.patchUser)(Number(user_id), username, name, email, role, password, avg_rating);
        res.status(200).send({ updatedUser });
    }
    catch (err) {
        next(err);
    }
});
exports.updateUser = updateUser;
