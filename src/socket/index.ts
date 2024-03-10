import {live_message_schema, message_schema, uuid_schema, video_call_invitation_request_schema} from "../validators";
import {
	I_JoinLiveRequest,
	I_LeaveLiveRequest,
	I_LiveMessageRequest,
	I_MessageRequest, T_JoinLiveResponse,
	T_VideoCallRequest
} from "../types/message";
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
import LiveRepository from "../repositories/live";
import {T_LiveMessageResponse} from "../types/live";

export default class SocketController {

	connections: Map<string, WebSocket>;
	liveRoomsConnections: Map<string, Array<{ connection: WebSocket, userId: string }>>;

	constructor(
		private readonly wss: WebSocketServer,
		private readonly server: Server,
		private readonly cache: Redis,
		private readonly userRepository: UserRepository,
		private readonly liveRepository: LiveRepository,
		private readonly friendRepository: FriendRepository,
		private readonly messageRepository: MessageRepository,
		private readonly notificationRepository: NotificationRepository,
	) {
		this.connections = new Map();
		this.liveRoomsConnections = new Map();
		this.start();
	}

	private async onData(bytes: RawData, host: WebSocket, user: I_UserSchema,) {
		try {
			const request: I_MessageRequest | T_VideoCallRequest | I_LiveMessageRequest | I_JoinLiveRequest
				= JSON.parse(bytes.toString());

			console.log(`Websocket received message request with type:`, request.type);

			switch (request.type) {
				case socket_events.MESSAGE: {
					await this.onMessage(request as I_MessageRequest, host, user);
					break;
				}
				case socket_events.JOIN_LIVE: {
					await this.onJoinLive(request as I_JoinLiveRequest, host, user);
					break;
				}
				case socket_events.LEAVE_LIVE: {
					await this.onLeaveLive(request as I_JoinLiveRequest, host, user);
					break;
				}
				case socket_events.LIVE_MESSAGE: {
					await this.onLiveMessage(request as I_LiveMessageRequest, host, user);
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

	private async onLiveMessage(request: I_LiveMessageRequest, host: WebSocket, user: I_UserSchema) {
		const r = live_message_schema.parse(request);

		const exists = await this.liveRepository.getLiveById(r.liveId);
		if (!exists) {
			return console.error('No friendship found between users', r);
		}

		const messageId = await this.liveRepository.createLiveMessage(
			r.liveId,
			r.sender,
			r.content
		);
		if (!messageId) {
			return console.error("Failed to save live message to the database");
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
		} as T_LiveMessageResponse));

		host.send(response);

		const liveConnections = this.liveRoomsConnections.get(r.liveId);
		if (!liveConnections) {
			return console.log(`WebSocket connection for live ${r.liveId} not found`);
		}

		liveConnections.forEach(c => c.connection.send(response));

		console.log(`Sent all messages to connections: ${liveConnections.length}`);
	}

	private async onLeaveLive(request: I_LeaveLiveRequest, host: WebSocket, user: I_UserSchema) {
		const liveId = uuid_schema.parse(request.liveId);

		const connection = this.connections.get(user.id);
		if (!connection) {
			return console.error(`No WebSocket connection for recipient: ${user}`);
		}

		let liveConnections = this.liveRoomsConnections.get(liveId) || [];
		liveConnections = liveConnections.filter((c) => c.userId !== user.id);

		this.liveRoomsConnections.set(liveId, liveConnections);

		console.log(`User ${user.id} joined live event ${liveId}`);
	}

	private async onVideoCallInvite(request: T_VideoCallRequest, host: WebSocket, user: I_UserSchema) {
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

	private async onJoinLive(request: I_JoinLiveRequest, host: WebSocket, user: I_UserSchema) {
		const liveId = uuid_schema.parse(request.liveId);

		const live = await this.liveRepository.getLiveById(liveId);
		if (!live) {
			return console.error(`No Active host for live: ${liveId}`);
		}

		const response: T_JoinLiveResponse = {
			type: socket_events.JOIN_LIVE,
			hostPeerId: live.user_id,
		};

		host.send(Buffer.from(JSON.stringify(response)));

		let liveConnections = this.liveRoomsConnections.get(liveId) || [];
		liveConnections.push({connection: host, userId: user.id});
		this.liveRoomsConnections.set(liveId, liveConnections);

		console.log(`User ${user.id} joined live event ${liveId} with host peer ID ${live.user_id}`);
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

	private onClose(code: number, reason: Buffer, user: I_UserSchema) {
		console.error(`Exiting with number (${code}) for reason`, reason.toString() + '.')
		this.connections.delete(user.id);
		this.cache.del(`user=${user.id}`);
	}
}
