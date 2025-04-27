import MessageRepository from "../repositories/message";
import { RawData, WebSocket, WebSocketServer } from "ws";
import FriendRepository from "../repositories/friend";
import UserRepository from "../repositories/user";
import { Server } from 'node:http';
import Redis from "ioredis";
import LiveRepository from "../repositories/live";
import Notificator from "../utilities/notificator";
import BaseSocket from "../base/socket.base";
import * as T from '../types';
import VLogger from "@instamenta/vlogger";
export default class SocketController extends BaseSocket {
    private readonly liveRepository;
    private readonly friendRepository;
    private readonly messageRepository;
    private readonly notificator;
    constructor(wss: WebSocketServer, server: Server, cache: Redis, logger: VLogger, userRepository: UserRepository, liveRepository: LiveRepository, friendRepository: FriendRepository, messageRepository: MessageRepository, notificator: Notificator);
    onData(bytes: RawData, host: WebSocket, user: T.User.Schema): Promise<void>;
    private onMessage;
    private onLiveMessage;
    private onLeaveLive;
    private onVideoCallInvite;
    private onJoinLive;
}
//# sourceMappingURL=index.d.ts.map