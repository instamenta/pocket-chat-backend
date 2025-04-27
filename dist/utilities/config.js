"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECURITY = exports.env = void 0;
require("dotenv/config");
const zod_1 = __importDefault(require("zod"));
const env = zod_1.default.object({
    FOLDER: zod_1.default.string(),
    CERTIFICATE_AGE: zod_1.default.string(),
    CERTIFICATE_NAME: zod_1.default.string(),
    SERVER_KEY_PATH: zod_1.default.string(),
    SERVER_CERT_PATH: zod_1.default.string(),
    CLIENT_CERT_PATH: zod_1.default.string(),
    SERVER_HOST: zod_1.default.string(),
    SERVER_PORT: zod_1.default.string(),
    SERVER_BACKLOG: zod_1.default.string(),
    DATABASE_URL: zod_1.default.string(),
    REDIS_HOST: zod_1.default.string(),
    REDIS_PORT: zod_1.default.string(),
    SALT_ROUNDS: zod_1.default.string(),
    JWT_SECRET: zod_1.default.string(),
    JWT_TOKEN_NAME: zod_1.default.string(),
    JWT_EXPIRATION_TIME: zod_1.default.string(),
    SOCKET_PORT: zod_1.default.string(),
    PEER_PORT: zod_1.default.string(),
    MEDIA_SOCKET_PORT: zod_1.default.string(),
}).parse(process.env);
exports.env = env;
const SECURITY = {
    FOLDER: env.FOLDER,
    AGE: env.CERTIFICATE_AGE,
    NAME: env.CERTIFICATE_NAME,
    SERVER_KEY_PATH: env.SERVER_KEY_PATH,
    SERVER_CERT_PATH: env.SERVER_CERT_PATH,
    CLIENT_CERT_PATH: env.CLIENT_CERT_PATH,
    SALT_ROUNDS: parseInt(env.SALT_ROUNDS),
    JWT_SECRET: env.JWT_SECRET,
    JWT_TOKEN_NAME: env.JWT_TOKEN_NAME,
    JWT_EXPIRATION_TIME: env.JWT_EXPIRATION_TIME
};
exports.SECURITY = SECURITY;
