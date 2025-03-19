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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApp = exports.updateApp = exports.createApp = exports.getCommentsByAppId = exports.getAppById = exports.getApps = void 0;
const apps_model_1 = require("../models/apps-model");
const connection_1 = __importDefault(require("../db/connection"));
const users_models_1 = require("../models/users-models");
const getApps = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apps = yield (0, apps_model_1.selectApps)();
        res.status(200).send({ apps });
    }
    catch (error) {
        next(error);
    }
});
exports.getApps = getApps;
const getAppById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { app_id } = req.params;
        if (isNaN(Number(app_id))) {
            return res.status(400).send({ msg: "Invalid app ID" });
        }
        const singleApp = yield (0, apps_model_1.selectAppById)(Number(app_id));
        res.status(200).send({ singleApp });
    }
    catch (error) {
        next(error);
    }
});
exports.getAppById = getAppById;
const getCommentsByAppId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { app_id } = req.params;
    if (isNaN(Number(app_id))) {
        return res.status(400).send({ msg: "Invalid app ID" });
    }
    try {
        const comments = yield (0, apps_model_1.selectAppComments)(Number(app_id));
        res.status(200).send({ comments });
    }
    catch (error) {
        next(error);
    }
});
exports.getCommentsByAppId = getCommentsByAppId;
const createApp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, category, app_url, app_img_url, developer_id, avg_rating, } = req.body;
    try {
        if (!name ||
            !description ||
            !category ||
            !app_url ||
            !app_img_url ||
            !developer_id) {
            return res.status(400).send({ msg: "Missing required fields" });
        }
        if (isNaN(Number(developer_id))) {
            return res.status(400).send({ msg: "Invalid developer_id" });
        }
        try {
            const developer = yield (0, users_models_1.selectUserById)(Number(developer_id));
            if (developer.role !== "developer") {
                return res.status(403).send({
                    msg: "Forbidden: Only users with developer role can create apps",
                });
            }
        }
        catch (error) {
            if (error.status === 404) {
                return res.status(404).send({ msg: "Developer not found" });
            }
            throw error;
        }
        const categoryResult = yield connection_1.default.query("SELECT * FROM categories WHERE name = $1", [category]);
        if (categoryResult.rows.length === 0) {
            return res.status(400).send({ msg: "Category does not exist" });
        }
        const newApp = yield (0, apps_model_1.insertApp)(name, description, category, app_url, app_img_url, developer_id, avg_rating);
        res.status(201).send({ newApp });
    }
    catch (error) {
        next(error);
    }
});
exports.createApp = createApp;
const updateApp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { app_id } = req.params;
    const { name, description, category, app_url, app_img_url, developer_id, avg_rating, } = req.body;
    try {
        if (isNaN(Number(app_id))) {
            return res.status(400).send({ msg: "Invalid app ID" });
        }
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send({ msg: "No fields to update" });
        }
        // First get the existing app to check ownership
        const existingApp = (yield (0, apps_model_1.selectAppById)(Number(app_id)));
        // If developer_id is provided in the request
        if (developer_id !== undefined) {
            if (isNaN(Number(developer_id))) {
                return res.status(400).send({ msg: "Invalid developer_id" });
            }
            // Check if the user exists and has role 'developer'
            try {
                const developer = yield (0, users_models_1.selectUserById)(Number(developer_id));
                if (developer.role !== "developer") {
                    return res.status(403).send({
                        msg: "Forbidden: Only users with developer role can be assigned to apps",
                    });
                }
                // If trying to reassign to a different developer
                if (existingApp.developer_id !== Number(developer_id)) {
                    return res.status(403).send({
                        msg: "Forbidden: This app does not belong to you.",
                    });
                }
            }
            catch (error) {
                if (error.status === 404) {
                    return res.status(404).send({ msg: "Developer not found" });
                }
                throw error;
            }
        }
        if (category) {
            const categoryResult = yield connection_1.default.query("SELECT * FROM categories WHERE name = $1", [category]);
            if (categoryResult.rows.length === 0) {
                return res.status(400).send({ msg: "Category does not exist" });
            }
        }
        const updatedApp = yield (0, apps_model_1.updateAppById)(Number(app_id), name, description, category, app_url, app_img_url, Number(developer_id), avg_rating);
        res.status(200).send({ updatedApp });
    }
    catch (error) {
        next(error);
    }
});
exports.updateApp = updateApp;
const deleteApp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { app_id } = req.params;
    const { developer_id } = req.body;
    try {
        if (isNaN(Number(app_id))) {
            return res.status(400).send({ msg: "Invalid app ID" });
        }
        // Check if the app exists before validating the developer_id
        try {
            const existingApp = (yield (0, apps_model_1.selectAppById)(Number(app_id)));
            if (developer_id === undefined) {
                return res.status(400).send({ msg: "Developer ID is required" });
            }
            if (isNaN(Number(developer_id))) {
                return res.status(400).send({ msg: "Invalid developer_id" });
            }
            if (existingApp.developer_id !== Number(developer_id)) {
                return res.status(403).send({
                    msg: "Forbidden: You can only delete your own apps",
                });
            }
            yield (0, apps_model_1.deleteAppById)(Number(app_id));
            return res.status(200).send({ msg: "App deleted successfully" });
        }
        catch (error) {
            if (error.status === 404) {
                return res.status(404).send({ msg: "App not found" });
            }
            throw error;
        }
    }
    catch (error) {
        next(error);
    }
});
exports.deleteApp = deleteApp;
