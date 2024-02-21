import {message_schema, video_call_invitation_request_schema} from "../validators";
import {I_MessageRequest, T_VideoCallRequest} from "../types/message";
import MessageRepository from "../repositories/message";
import {RawData, WebSocket, WebSocketServer} from "ws";
import FriendRepository from "../repositories/friend";
import {env, SECURITY} from "../utilities/config";
import UserRepository from "../repositories/user";
import {I_UserSchema} from "../types/user";
import JWT from "../utilities/jwt";
import * as Cookies from 'cookie';
import {Server} from 'node:http'
import Redis from "ioredis";
import NotificationRepository from "../repositories/notification";
import {socket_events} from "../utilities/enumerations";

export default class SocketController {

	connections: Map<string, WebSocket>;

	constructor(
		private readonly wss: WebSocketServer,
		private readonly server: Server,
		private readonly cache: Redis,
		private readonly userRepository: UserRepository,
		private readonly friendRepository: FriendRepository,
		private readonly messageRepository: MessageRepository,
		private readonly notificationRepository: NotificationRepository,
	) {
		this.connections = new Map()
		this.start();
	}

	private async onData(bytes: RawData, host: WebSocket, user: I_UserSchema,) {
		try {
			const request: I_MessageRequest | T_VideoCallRequest = JSON.parse(bytes.toString());

			console.log(`Websocket received message request with type:`, request.type);

			switch (request.type) {
				case socket_events.MESSAGE: {
					await this.onMessage(request as I_MessageRequest, host, user);
					break;
				}
				case socket_events.VIDEO_CALL_INVITE: {
					await this.onVideoCallInvite(request as T_VideoCallRequest, host, user);
					break;
				}
				case socket_events.VOICE_CALL_INVITE: {
					await this.onVideoCallInvite(request as T_VideoCallRequest, host, user)
					break
				}
				default:
					console.log(`Unimplemented type`, request);
			}
		} catch (error) {
			console.error(`Error handling message from senderId: ${user.id}`, error);
		}
	}

	private async onMessage(request: I_MessageRequest, host: WebSocket, user: I_UserSchema) {
		const r = message_schema.parse(request);

		if (!r.images?.length && !r.content.length && !r.files.length) return console.log('Empty');

		const friendship = await this.friendRepository.getBySenderAndRecipient(user.id, r.recipient);
		if (!friendship) {
			return console.error('No friendship found between users', {data: r, sender: user.id});
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
			return console.error("Failed to save message to the database");
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
			seen: true,
			type: r.type,
			sender_id: r.sender,
			recipient_id: r.recipient,
			content: `Message from ${user.username}`
		};

		const connection = this.connections.get(r.recipient);
		if (connection) {
			await this.notificationRepository.createNotification(notification);

			connection.send(response);

			console.log(`Found WebSocket connection for recipient ${r.recipient} and Send Message`)
		} else {
			notification.seen = false;

			await this.notificationRepository.createNotification(notification);

			console.error(`No WebSocket connection for recipient: ${r.recipient} and Pushed To Notifications`);
		}
	}

	private async onVideoCallInvite(request: T_VideoCallRequest, host: WebSocket, user: I_UserSchema) {
		console.log(request);
		const r = video_call_invitation_request_schema.parse(request);

		const connection = this.connections.get(r.recipient);
		if (!connection) {
			return console.error(`No WebSocket connection for recipient: ${r.recipient}`);
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


	private start() {
		this.server.listen(env.SOCKET_PORT, () => {
			console.log(`WebSocket is running on ws://${env.SERVER_HOST}:${env.SOCKET_PORT}`);
		});
		this.wss.on('connection', this.onConnection);
	}

	private onConnection = async (ws: WebSocket, r: any) => {
		const user = JWT.getUser(Cookies.parse(r.headers.cookie ?? '')[SECURITY.JWT_TOKEN_NAME] ?? '');
		if (!user) {
			return ws.close(1);
		}
		const userData = await this.userRepository.getUserById(user.id)
		if (!userData) {
			return ws.close(1)
		}
		this.connections.set(userData.id, ws);
		this.cache.set(`user=${user.id}`, JSON.stringify(userData));

		ws.on('message', (data) => this.onData(data, ws, userData));
		ws.on('close', (code, reason) => this.onClose(code, reason, userData));
		ws.on('error', console.error);
	}

	private handleBroadcast() {
		this.connections.forEach((connection, id) => {
			// const message = JSON.stringify(this.users.get(id));
			// connection.send(message);
		});
	}

	private onClose(code: number, reason: Buffer, user: I_UserSchema) {
		console.error(`Exiting with number (${code}) for reason`, reason.toString() + '.')

		this.connections.delete(user.id);
		this.cache.del(`user=${user.id}`);
	}
}
