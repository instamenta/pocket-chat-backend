"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("./config");
class BCrypt {
    async hashPassword(password) {
        try {
            const salt = await bcrypt_1.default.genSalt(config_1.SECURITY.SALT_ROUNDS);
            return await bcrypt_1.default.hash(password, salt);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async comparePasswords(plainPassword, hashedPassword) {
        return await bcrypt_1.default.compare(plainPassword, hashedPassword)
            .catch((error) => {
            console.error(error);
            return false;
        });
    }
}
exports.default = BCrypt;
