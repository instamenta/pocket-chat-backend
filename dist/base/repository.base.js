"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    database;
    log;
    constructor(database, logger) {
        this.database = database;
        this.log = logger.getVlogger(this.constructor.name);
    }
    errorHandler(error, method) {
        throw new Error(`${this.constructor.name}.${method}(): Error`, {
            cause: error,
        });
    }
}
exports.BaseRepository = BaseRepository;
