"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_peer_1 = __importDefault(require("simple-peer"));
const wrtc = require('wrtc');
class MediaController {
    io;
    constructor(io) {
        this.io = io;
        this.start().then();
    }
    async start() {
        this.io.on('connection', (socket) => {
            socket.on('offer', (data) => {
                const peer = new simple_peer_1.default({ initiator: false, trickle: false, wrtc });
                peer.on('signal', signal => {
                    socket.emit('answer', signal);
                });
                peer.on('stream', (stream) => {
                    console.log(`On Stream ${stream}`);
                    // @ts-ignore
                    this.forwardStreamToMediaServer(stream);
                });
                peer.signal(data);
            });
        });
    }
}
exports.default = MediaController;
