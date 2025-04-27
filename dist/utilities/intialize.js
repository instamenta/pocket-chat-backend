"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize_all = initialize_all;
const config_1 = require("./config");
const pg_1 = require("pg");
const ioredis_1 = __importDefault(require("ioredis"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const vlogger_1 = __importDefault(require("@instamenta/vlogger"));
const corsOptions = {
    origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3004', 'http://localhost:5173', 'http://192.168.1.8:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', config_1.SECURITY.JWT_TOKEN_NAME],
};
async function initialize_all() {
    const logger = vlogger_1.default.getInstance();
    const log = logger.getVlogger('App');
    const api = (0, express_1.default)();
    api.use((0, cors_1.default)(corsOptions));
    api.use((0, cookie_parser_1.default)());
    api.use(body_parser_1.default.json());
    api.use((0, morgan_1.default)('dev'));
    api.use(body_parser_1.default.urlencoded({ extended: true }));
    api.on('error', (e) => { log.error({ e, m: 'Express server error' }); });
    const database = new pg_1.Client({ connectionString: config_1.env.DATABASE_URL });
    await database.connect();
    const cache = new ioredis_1.default({ host: config_1.env.REDIS_HOST, port: parseInt(config_1.env.REDIS_PORT) });
    return { api, database, cache, logger };
}
