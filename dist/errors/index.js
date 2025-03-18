"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverErrorHandler = exports.customErrorHandler = exports.psqlErrorHandler = exports.inputErrorHandler = void 0;
const inputErrorHandler = (req, res, next) => {
    res.status(404).send({ msg: "Invalid input" });
    const err = new Error("Invalid input");
    err.status = 404;
    next(err);
};
exports.inputErrorHandler = inputErrorHandler;
const psqlErrorHandler = (err, req, res, next) => {
    if (err.code === "23502" || err.code === "22P02" || err.code === "23503") {
        res.status(400).send({ msg: "Bad request" });
    }
    else
        next(err);
};
exports.psqlErrorHandler = psqlErrorHandler;
const customErrorHandler = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
    else
        next(err);
};
exports.customErrorHandler = customErrorHandler;
const serverErrorHandler = (err, req, res, next) => {
    console.log(err, "<<<<<< ------ Unhandled error");
    res.status(500).send({ msg: "Internal server error" });
};
exports.serverErrorHandler = serverErrorHandler;
