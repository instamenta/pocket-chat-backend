import Redis from "ioredis";
import { RawData, WebSocket, WebSocketServer } from "ws";
import { Server } from "node:http";
import UserRepository from "../repositories/user";
import * as T from '../types';
import VLogger, { IVlog } from "@instamenta/vlogger";
export default class BaseSocket {
    protected readonly wss: WebSocketServer;
    protected readonly server: Server;
    protected readonly cache: Redis;
    protected readonly userRepository: UserRepository;
    protected readonly log: IVlog;
    protected connections: Map<string, WebSocket>;
    protected liveRoomsConnections: Map<string, Array<{
        connection: WebSocket;
        userId: string;
    }>>;
    constructor(wss: WebSocketServer, server: Server, cache: Redis, logger: VLogger, userRepository: UserRepository);
    protected onClose(code: number, reason: Buffer, user: T.User.Schema): void;
    protected start(): void;
    protected onConnection: (ws: WebSocket, r: any) => Promise<void>;
    protected onData(bytes: RawData, host: WebSocket, user: T.User.Schema): Promise<void>;
}
//# sourceMappingURL=socket.base.d.ts.map