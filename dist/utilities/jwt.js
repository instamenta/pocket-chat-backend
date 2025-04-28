"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
exports.getTokenFromCookie = getTokenFromCookie;
exports.removeTokenFromCookie = removeTokenFromCookie;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const jwtSecret = config_1.SECURITY.JWT_SECRET;
const signOptions = { expiresIn: config_1.SECURITY.JWT_EXPIRATION_TIME };
function signToken(userData) {
    return jsonwebtoken_1.default.sign(userData, jwtSecret, signOptions);
}
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        return decoded;
    }
    catch {
        return null;
    }
}
function getTokenFromCookie(request) {
    return request.cookies[config_1.SECURITY.JWT_TOKEN_NAME] || null;
}
function removeTokenFromCookie(response) {
    response.setHeader("Set-Cookie", [
        "X-Authorization-Token=;" +
            "Expires=Thu, 01 Jan 1970 00:00:00 GMT;" +
            "HttpOnly; Path=/;",
    ]);
}
