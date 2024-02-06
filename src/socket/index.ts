import {RawData, WebSocket, WebSocketServer} from "ws";
import {env, SECURITY} from "../utilities/config";
import JWT from "../utilities/jwt";
import * as Cookies from 'cookie';
import {message_schema, video_call_invitation_request_schema} from "../validators";
import {I_MessageRequest, T_VideoCallRequest} from "../types/message";
import MessageRepository from "../repositories/message";
import FriendRepository from "../repositories/friend";
import {Server} from 'node:http'
import UserRepository from "../repositories/user";
import {I_UserSchema} from "../types/user";
import Redis from "ioredis";

export default class SocketController {

	connections: Map<string, WebSocket>;

	constructor(
		private readonly wss: WebSocketServer,
		private readonly server: Server,
		private readonly cache: Redis,
		private readonly messageRepository: MessageRepository,
		private readonly friendRepository: FriendRepository,
		private readonly userRepository: UserRepository
	) {
		this.connections = new Map()
		this.start();
	}

	private async onMessage(request: I_MessageRequest, host: WebSocket, user: I_UserSchema) {
		const r = message_schema.parse(request);

		const friendship = await this.friendRepository.getBySenderAndRecipient(user.id, r.recipient);
		if (!friendship) {
			return console.error('No friendship found between users', {data: r, sender: user.id});
		}

		const messageId = await this.messageRepository.createMessage({
			sender: r.sender,
			recipient: r.recipient,
			content: r.content,
			friendship: friendship.id
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
			message_id: messageId,
			recipient_id: r.recipient,
			friendship_id: friendship.id,
		}));

		host.send(response);

		const connection = this.connections.get(r.recipient);
		if (!connection) {
			return console.error(`No WebSocket connection for recipient: ${r.recipient}`);
		}
		connection.send(response);
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

	private async onData(bytes: RawData, host: WebSocket, user: I_UserSchema,) {
		try {
			const request: I_MessageRequest | T_VideoCallRequest = JSON.parse(bytes.toString());

			if (request.type === 'message') {
				await this.onMessage(request as I_MessageRequest, host, user);
			} else if (request.type === 'video-call-invite') {
				await this.onVideoCallInvite(request as T_VideoCallRequest, host, user);
			} else {
				return console.log(`Unimplemented type`, request);
			}
		} catch (error) {
			console.error(`Error handling message from senderId: ${user.id}`, error);
		}
	}

	private handleBroadcast() {
		this.connections.forEach((connection, id) => {
			// const message = JSON.stringify(this.users.get(id));
			// connection.send(message);
		});
	}

	private start() {
		this.server.listen(env.SOCKET_PORT, () => {
			console.log(`WebSocket is running on ws://${env.SERVER_HOST}:${env.SOCKET_PORT}`);
		});
		this.wss.on('connection', this.onConnection);
	}

	private onConnection = async (ws: WebSocket, r: any) => {
		const user = JWT.getUser(Cookies.parse(r.headers.cookie ?? '')[SECURITY.JWT_TOKEN_NAME] ?? '');
		if (!user) return ws.close(1);

		const userData = await this.userRepository.getUserById(user.id)
		if (!userData) return ws.close(1)


		this.connections.set(userData.id, ws);
		this.cache.set(`user=${user.id}`, JSON.stringify(userData));

		ws.on('message', (data) => this.onData(data, ws, userData));
		ws.on('close', (code, reason) => this.onClose(code, reason, userData));
		ws.on('error', console.error);
	}

	private onClose(code: number, reason: Buffer, user: I_UserSchema) {
		console.error(`Exiting with number (${code}) for reason`, reason.toString())

		this.connections.delete(user.id);
		this.cache.del(`user=${user.id}`);
	}
}
