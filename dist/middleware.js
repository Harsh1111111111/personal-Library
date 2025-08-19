"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const index_1 = require("./index");
// this middleware is used to authenthicate the user
async function auth(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            message: "sign in first"
        });
    }
    const decoded_data = jsonwebtoken_1.default.verify(token, index_1.jwt_secret);
    ;
    const userId = decoded_data.userId;
    const user = await db_1.UserModel.findById(userId);
    if (!user) {
        return res.status(401).json({
            message: "user does not exist"
        });
    }
    // @ts-ignore
    req.userId = userId;
    next();
}
//# sourceMappingURL=middleware.js.map