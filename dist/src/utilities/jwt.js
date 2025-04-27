"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
class JWT {
    static secret = config_1.SECURITY.JWT_SECRET;
    static signOptions = { expiresIn: config_1.SECURITY.JWT_EXPIRATION_TIME };
    static signToken(userData) {
        return jsonwebtoken_1.default.sign(userData, JWT.secret, JWT.signOptions);
    }
    static verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.secret);
            return decoded;
        }
        catch {
            return null;
        }
    }
    static setTokenCookie(w, token) {
        w.cookie(config_1.SECURITY.JWT_TOKEN_NAME, token, { httpOnly: true });
    }
    static getTokenFromCookie(request) {
        return request.cookies[config_1.SECURITY.JWT_TOKEN_NAME] || null;
    }
    static authenticate(request, response, next) {
        const token = this.getTokenFromCookie(request);
        if (!token)
            return response.status(401).json({ message: 'Unauthorized' });
        const user = this.verifyToken(token);
        if (!user)
            return response.status(401).json({ message: 'Unauthorized' });
        request.user = user;
        next();
    }
    static getUser(token) {
        return this.verifyToken(token) ?? null;
    }
    static removeTokenFromCookie(w) {
        w.setHeader('Set-Cookie', [
            'X-Authorization-Token=;'
                + 'Expires=Thu, 01 Jan 1970 00:00:00 GMT;'
                + 'HttpOnly; Path=/;',
        ]);
    }
}
exports.default = JWT;
