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
const config_1 = require("../utilities/config");
const jwt_1 = __importDefault(require("../utilities/jwt"));
const Cookies = __importStar(require("cookie"));
const vanilla_utility_pack_1 = require("@instamenta/vanilla-utility-pack");
class BaseSocket {
    wss;
    server;
    cache;
    userRepository;
    log;
    connections;
    liveRoomsConnections;
    constructor(wss, server, cache, logger, userRepository) {
        this.wss = wss;
        this.server = server;
        this.cache = cache;
        this.userRepository = userRepository;
        this.connections = new Map();
        this.liveRoomsConnections = new Map();
        this.log = logger.getVlogger(this.constructor.name);
        this.start();
    }
    onClose(code, reason, user) {
        this.log.error({ e: '', m: `Exiting with number (${code}) for reason ${reason.toString()}.` });
        this.connections.delete(user.id);
        this.cache.del(`user=${user.id}`);
    }
    start() {
        this.server.listen(config_1.env.SOCKET_PORT, () => {
            this.log.info({ m: `WebSocket is running on ws://${config_1.env.SERVER_HOST}:${config_1.env.SOCKET_PORT}` });
        });
        this.wss.on('connection', this.onConnection);
    }
    onConnection = async (ws, r) => {
        const user = jwt_1.default.getUser(Cookies.parse(r.headers.cookie ?? '')[config_1.SECURITY.JWT_TOKEN_NAME] ?? '');
        if (!user) {
            ws.close(1);
            return;
        }
        const userData = await this.userRepository.getUserById(user.id);
        if (!userData) {
            ws.close(1);
            return;
        }
        this.connections.set(userData.id, ws);
        this.cache.set(`user=${user.id}`, JSON.stringify(userData));
        ws.on('message', (data) => this.onData(data, ws, userData));
        ws.on('close', (code, reason) => { this.onClose(code, reason, userData); });
        ws.on('error', (e) => this.log.error({ e, m: 'Websocket ran into Error' }));
    };
    async onData(bytes, host, user) {
        throw new vanilla_utility_pack_1.NotImplementedError(`Implement ${this.constructor.name}.onData()`);
    }
}
exports.default = BaseSocket;
