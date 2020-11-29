"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorized = void 0;
var unauthorized_error_1 = require("../errors/unauthorized-error");
exports.authorized = function (req, res, next) {
    if (!req.currentUser) {
        throw new unauthorized_error_1.UnauthorizedError();
    }
    return next();
};
