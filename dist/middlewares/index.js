"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middlewares = void 0;
exports.isGuest = isGuest;
exports.isAuthorized = isAuthorized;
exports.errorHandler = errorHandler;
const JWT = __importStar(require("../utilities/jwt"));
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
const jsonwebtoken_1 = require("jsonwebtoken");
exports.Middlewares = { isAuthorized, isGuest, errorHandler };
function isGuest(request, response, next) {
    const token = JWT.getTokenFromCookie(request);
    if (token) {
        try {
            const user = JWT.verifyToken(token);
            if (user) {
                console.log("Middleware.isGuest(): FORBIDDEN", user);
                return response
                    .status(http_status_codes_1.default.FORBIDDEN)
                    .json({ message: "User is already authenticated" });
            }
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                console.log("Middleware.isGuest(): Token expired");
                JWT.removeTokenFromCookie(response);
            }
            return response.status(http_status_codes_1.default.EXPECTATION_FAILED).end();
        }
    }
    next();
}
function isAuthorized(request, response, next) {
    const token = JWT.getTokenFromCookie(request);
    if (!token) {
        console.log("Middleware.isAuthorized(): UNAUTHORIZED");
        return response
            .status(http_status_codes_1.default.UNAUTHORIZED)
            .json({ message: "User is not authenticated" });
    }
    const user = JWT.verifyToken(token);
    if (!user) {
        console.log("Middleware.isAuthorized(): UNAUTHORIZED");
        return response
            .status(http_status_codes_1.default.UNAUTHORIZED)
            .json({ message: "Invalid token" });
    }
    request.user = user;
    next();
}
function errorHandler(error, _request, response, _next) {
    console.error(error.stack);
    response
        .status(http_status_codes_1.default.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
}
