"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const zod_1 = require("zod");
const http_status_codes_1 = __importDefault(require("@instamenta/http-status-codes"));
class BaseController {
    repository;
    log;
    constructor(repository, logger) {
        this.repository = repository;
        this.log = logger.getVlogger(this.constructor.name);
    }
    errorHandler(error, response) {
        if (error instanceof zod_1.ZodError) {
            const formattedError = error.errors.map((issue) => {
                return {
                    path: issue.path.join("."),
                    message: issue.message,
                };
            });
            this.log.error({ e: formattedError, f: "errorHandler" });
            response.status(http_status_codes_1.default.BAD_REQUEST).end();
        }
        else {
            this.log.error({ e: error, f: "errorHandler" });
            response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
        }
    }
}
exports.BaseController = BaseController;
