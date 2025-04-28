"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
exports.setTokenCookie = setTokenCookie;
exports.getTokenFromCookie = getTokenFromCookie;
exports.authenticate = authenticate;
exports.getUser = getUser;
exports.removeTokenFromCookie = removeTokenFromCookie;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const jwt_secret = config_1.SECURITY.JWT_SECRET;
const signOptions = { expiresIn: config_1.SECURITY.JWT_EXPIRATION_TIME };
function signToken(userData) {
    return jsonwebtoken_1.default.sign(userData, jwt_secret, signOptions);
}
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwt_secret);
        return decoded;
    }
    catch {
        return null;
    }
}
function setTokenCookie(response, token) {
    response.cookie(config_1.SECURITY.JWT_TOKEN_NAME, token, { httpOnly: true });
}
function getTokenFromCookie(request) {
    return request.cookies[config_1.SECURITY.JWT_TOKEN_NAME] || null;
}
function authenticate(request, response, next) {
    const token = getTokenFromCookie(request);
    if (!token)
        return response.status(401).json({ message: 'Unauthorized' });
    const user = verifyToken(token);
    if (!user)
        return response.status(401).json({ message: 'Unauthorized' });
    request.user = user;
    next();
}
function getUser(token) {
    return verifyToken(token) ?? null;
}
function removeTokenFromCookie(response) {
    response.setHeader('Set-Cookie', [
        'X-Authorization-Token=;'
            + 'Expires=Thu, 01 Jan 1970 00:00:00 GMT;'
            + 'HttpOnly; Path=/;',
    ]);
}
