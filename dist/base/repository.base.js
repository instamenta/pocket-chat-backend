"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    database;
    log;
    constructor(database, logger) {
        this.database = database;
        this.log = logger.getVlogger(this.constructor.name);
    }
    errorHandler(error, method) {
        throw new Error(`${this.constructor.name}.${method}(): Error`, { cause: error });
    }
}
exports.default = BaseRepository;
