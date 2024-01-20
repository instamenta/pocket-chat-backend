"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const socket_io_1 = require("socket.io");
const selfsigned_1 = __importDefault(require("selfsigned"));
void function start_service() {
    const CERTIFICATE_PATH = "../security/cert.pem";
    const KEY_PATH = "../security/key.pem";
    const SECURITY_FOLDER = "../security";
    const SERVER_PORT = 3002;
    const SERVER_HOST = 'localhost';
    const SERVER_BACKLOG = 504;
    const CERTIFICATE_AGE = 365;
    const CERTIFICATE_NAME = 'commonName';
    if (!fs_1.default.existsSync(SECURITY_FOLDER))
        fs_1.default.mkdirSync(SECURITY_FOLDER);
    console.log(!fs_1.default.existsSync(SECURITY_FOLDER));
    console.log(!fs_1.default.existsSync(CERTIFICATE_PATH));
    console.log(!fs_1.default.existsSync(KEY_PATH));
    if (!fs_1.default.existsSync(CERTIFICATE_PATH) || !fs_1.default.existsSync(KEY_PATH)) {
        const generated_result = selfsigned_1.default.generate([{ name: CERTIFICATE_NAME, value: SERVER_HOST }], { days: CERTIFICATE_AGE });
        console.log(generated_result);
        fs_1.default.writeFileSync(KEY_PATH, generated_result.private);
        fs_1.default.writeFileSync(CERTIFICATE_PATH, generated_result.cert);
    }
    const server = https_1.default.createServer({
        key: fs_1.default.readFileSync(KEY_PATH),
        cert: fs_1.default.readFileSync(CERTIFICATE_PATH)
    });
    const io = new socket_io_1.Server(server, { /* options */});
    io.on("connection", (socket) => {
        // Handle socket connections
        console.log("Socket connected:", socket.id);
    });
    server.listen(SERVER_PORT, SERVER_HOST, SERVER_BACKLOG, () => {
        console.log(`Server is running on https://${SERVER_HOST}:${SERVER_PORT}`);
    });
    server.on("error", (error) => console.error(`Server emitted error event`, error));
}();
