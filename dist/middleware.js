"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.adminauth = adminauth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
// import {usercontent } from './index';
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// this middleware is used to authenthicate the user
async function auth(req, res, next) {
    const jwt_secret = process.env.JWT_SECRET;
    if (!jwt_secret) {
        return res.json({
            message: "unable to verify or make the token because jwtsecreat is not available"
        });
    }
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            message: "sign in first"
        });
    }
    const decoded_data = jsonwebtoken_1.default.verify(token, jwt_secret);
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
async function adminauth(req, res, next) {
    const privatekey = process.env.private_key_getusers;
    if (!privatekey) {
        return res.json({
            message: "private key not given"
        });
    }
    const headerprivatekey = req.header('.x-api-Key');
    if (privatekey != headerprivatekey) {
        return res.json({
            message: "you are not the super maker you cheater"
        });
    }
    next();
}
//# sourceMappingURL=middleware.js.map