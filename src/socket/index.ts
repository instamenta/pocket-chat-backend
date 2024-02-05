import {RawData, WebSocket, WebSocketServer} from "ws";
import {env, SECURITY} from "../utilities/config";
import JWT from "../utilities/jwt";
import * as Cookies from 'cookie';
import {message_schema} from "../validators";
import {I_MessageRequest} from "../types/message";
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

	private async onMessage(bytes: RawData, host: WebSocket, user: I_UserSchema,) {
		try {
			const r: I_MessageRequest = message_schema.parse(JSON.parse(bytes.toString()));

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

		ws.on('message', (message) => this.onMessage(message, ws, userData));
		ws.on('close', (code, reason) => this.onClose(code, reason, userData));
		ws.on('error', console.error);
	}

	private onClose(code: number, reason: Buffer, user: I_UserSchema) {
		console.error(`Exiting with number (${code}) for reason`, reason.toString())

		this.connections.delete(user.id);
		this.cache.del(`user=${user.id}`);
	}
}
