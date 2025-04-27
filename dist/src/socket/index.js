"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enumerations_1 = require("../utilities/enumerations");
const socket_base_1 = __importDefault(require("../base/socket.base"));
const validators_1 = __importDefault(require("../validators"));
class SocketController extends socket_base_1.default {
    liveRepository;
    friendRepository;
    messageRepository;
    notificator;
    constructor(wss, server, cache, logger, userRepository, liveRepository, friendRepository, messageRepository, notificator) {
        super(wss, server, cache, logger, userRepository);
        this.liveRepository = liveRepository;
        this.friendRepository = friendRepository;
        this.messageRepository = messageRepository;
        this.notificator = notificator;
    }
    async onData(bytes, host, user) {
        try {
            const request = JSON.parse(bytes.toString());
            console.log(`Websocket received message request with type:`, request.type);
            switch (request.type) {
                case enumerations_1.socket_events.MESSAGE: {
                    await this.onMessage(request, host, user);
                    break;
                }
                case enumerations_1.socket_events.JOIN_LIVE: {
                    await this.onJoinLive(request, host, user);
                    break;
                }
                case enumerations_1.socket_events.LEAVE_LIVE: {
                    await this.onLeaveLive(request, host, user);
                    break;
                }
                case enumerations_1.socket_events.LIVE_MESSAGE: {
                    await this.onLiveMessage(request, host, user);
                    break;
                }
                case enumerations_1.socket_events.VIDEO_CALL_INVITE: {
                    await this.onVideoCallInvite(request, host, user);
                    break;
                }
                case enumerations_1.socket_events.VOICE_CALL_INVITE: {
                    await this.onVideoCallInvite(request, host, user);
                    break;
                }
                default:
                    console.log(`Unimplemented type`, request);
            }
        }
        catch (error) {
            console.error(`Error handling message from senderId: ${user.id}`, error);
        }
    }
    async onMessage(request, host, user) {
        const r = validators_1.default.message.parse(request);
        if (!r.images?.length && !r.content.length && !r.files.length) {
            console.log('Empty');
            return;
        }
        const friendship = await this.friendRepository.getBySenderAndRecipient(user.id, r.recipient);
        if (!friendship) {
            console.error('No friendship found between users', { data: r, sender: user.id });
            return;
        }
        const messageId = await this.messageRepository.createMessage({
            sender: r.sender,
            recipient: r.recipient,
            content: r.content,
            friendship: friendship.id,
            images: r.images,
            files: r.files,
        });
        if (!messageId) {
            console.error("Failed to save message to the database");
            return;
        }
        const response = Buffer.from(JSON.stringify({
            type: r.type,
            edited: false,
            created_at: r.date,
            updated_at: r.date,
            content: r.content,
            sender_id: r.sender,
            files: r.files,
            images: r.images,
            message_id: messageId,
            recipient_id: r.recipient,
            friendship_id: friendship.id,
        }));
        host.send(response);
        const notification = {
            type: enumerations_1.notification_types.MESSAGE,
            recipient_id: r.recipient,
            reference_id: r.sender,
            sender_id: r.sender,
            content: r.content,
            seen: true,
        };
        const connection = this.connections.get(r.recipient);
        if (connection) {
            connection.send(response);
            console.log(`Found WebSocket connection for recipient ${r.recipient} and Send Message`);
            await this.notificator.handleNotification(notification);
        }
        else {
            notification.seen = false;
            console.error(`No WebSocket connection for recipient: ${r.recipient} and Pushed To Notifications`);
            await this.notificator.handleNotification(notification);
        }
    }
    async onLiveMessage(request, host, user) {
        const r = validators_1.default.live_message.parse(request);
        const exists = await this.liveRepository.getLiveById(r.liveId);
        if (!exists) {
            console.error('No friendship found between users', r);
            return;
        }
        const messageId = await this.liveRepository.createLiveMessage(r.liveId, r.sender, r.content);
        if (!messageId) {
            console.error("Failed to save live message to the database");
            return;
        }
        const response = Buffer.from(JSON.stringify({
            live_id: r.liveId,
            user_id: r.sender,
            user_picture: user.picture,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            created_at: new Date().toISOString(),
            content: r.content,
            type: r.type,
            message_id: messageId,
        }));
        host.send(response);
        const liveConnections = this.liveRoomsConnections.get(r.liveId);
        if (!liveConnections) {
            console.log(`WebSocket connection for live ${r.liveId} not found`);
            return;
        }
        liveConnections.forEach(c => { c.connection.send(response); });
        console.log(`Sent all messages to connections: ${liveConnections.length}`);
    }
    async onLeaveLive(request, host, user) {
        const liveId = validators_1.default.uuid.parse(request.liveId);
        const connection = this.connections.get(user.id);
        if (!connection) {
            console.error(`No WebSocket connection for recipient: ${user}`);
            return;
        }
        let liveConnections = this.liveRoomsConnections.get(liveId) || [];
        liveConnections = liveConnections.filter((c) => c.userId !== user.id);
        this.liveRoomsConnections.set(liveId, liveConnections);
        console.log(`User ${user.id} joined live event ${liveId}`);
    }
    async onVideoCallInvite(request, host, user) {
        const r = validators_1.default.video_call_invitation_request.parse(request);
        const connection = this.connections.get(r.recipient);
        if (!connection) {
            console.error(`No WebSocket connection for recipient: ${r.recipient}`);
            return;
        }
        const response = Buffer.from(JSON.stringify({
            type: r.type,
            room_id: r.room,
            sender_id: r.sender,
            recipient_id: r.recipient,
            date: new Date().toISOString(),
        }));
        connection.send(response);
    }
    async onJoinLive(request, host, user) {
        const liveId = validators_1.default.uuid.parse(request.liveId);
        const live = await this.liveRepository.getLiveById(liveId);
        if (!live) {
            console.error(`No Active host for live: ${liveId}`);
            return;
        }
        const response = {
            type: enumerations_1.socket_events.JOIN_LIVE,
            hostPeerId: live.user_id,
        };
        host.send(Buffer.from(JSON.stringify(response)));
        const liveConnections = this.liveRoomsConnections.get(liveId) || [];
        liveConnections.push({ connection: host, userId: user.id });
        this.liveRoomsConnections.set(liveId, liveConnections);
        console.log(`User ${user.id} joined live event ${liveId} with host peer ID ${live.user_id}`);
    }
}
exports.default = SocketController;
