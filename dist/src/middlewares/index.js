"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGuest = isGuest;
exports.isAuthorized = isAuthorized;
exports.errorHandler = errorHandler;
const jwt_1 = __importDefault(require("../utilities/jwt"));
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const jsonwebtoken_1 = require("jsonwebtoken");
function isGuest(r, w, next) {
    const token = jwt_1.default.getTokenFromCookie(r);
    if (token) {
        try {
            const user = jwt_1.default.verifyToken(token);
            if (user) {
                console.log('Middleware.isGuest(): FORBIDDEN', user);
                return w.status(http_status_codes_1.default.FORBIDDEN).json({ message: 'User is already authenticated' });
            }
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                console.log('Middleware.isGuest(): Token expired');
                jwt_1.default.removeTokenFromCookie(w);
            }
            return w.status(http_status_codes_1.default.EXPECTATION_FAILED).end();
        }
    }
    next();
}
function isAuthorized(r, w, next) {
    const token = jwt_1.default.getTokenFromCookie(r);
    if (!token) {
        console.log('Middleware.isAuthorized(): UNAUTHORIZED');
        return w.status(http_status_codes_1.default.UNAUTHORIZED).json({ message: 'User is not authenticated' });
    }
    const user = jwt_1.default.verifyToken(token);
    if (!user) {
        console.log('Middleware.isAuthorized(): UNAUTHORIZED');
        return w.status(http_status_codes_1.default.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
    r.user = user;
    next();
}
function errorHandler(err, r, w, next) {
    console.error(err.stack);
    w.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
}
const Middlewares = { isGuest, isAuthorized, errorHandler };
exports.default = Middlewares;
