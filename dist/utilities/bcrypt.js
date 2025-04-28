"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BCryptHashingHandler = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("./config");
class BCryptHashingHandler {
    log;
    constructor(logger) {
        this.log = logger.getVlogger(this.constructor.name);
    }
    async hashPassword(password) {
        try {
            const salt = await bcrypt_1.default.genSalt(config_1.SECURITY.SALT_ROUNDS);
            return await bcrypt_1.default.hash(password, salt);
        }
        catch (error) {
            this.log.error({ e: error, f: "hashPassword" });
            throw error;
        }
    }
    async comparePasswords(plainPassword, hashedPassword) {
        return await bcrypt_1.default
            .compare(plainPassword, hashedPassword)
            .catch((error) => {
            this.log.error({ e: error, f: "comparePasswords" });
            return false;
        });
    }
}
exports.BCryptHashingHandler = BCryptHashingHandler;
