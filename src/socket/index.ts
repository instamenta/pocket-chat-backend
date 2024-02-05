import {RawData, WebSocket, WebSocketServer} from "ws";
import {env, SECURITY} from "../utilities/config";
import JWT from "../utilities/jwt";
import * as Cookies from 'cookie';
import {message_schema} from "../validators";
import {I_MessageRequest} from "../types/message";
import MessageRepository from "../repositories/message";
import FriendRepository from "../repositories/friend";
import {IncomingMessage, Server, ServerResponse} from 'node:http'
import {Socket} from 'node:net';
import UserRepository from "../repositories/user";
import {I_UserSchema} from "../types/user";

export default class SocketController {

	connections: Map<string, WebSocket>;
	users: Map<string, I_UserSchema>;

	constructor(
		private readonly wss: WebSocketServer,
		private readonly server: Server<IncomingMessage, ServerResponse>,
		private readonly messageRepository: MessageRepository,
		private readonly friendRepository: FriendRepository,
		private readonly userRepository: UserRepository
	) {
		this.connections = new Map()
		this.users = new Map()
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
			const message = JSON.stringify(this.users.get(id));
			connection.send(message);
		});
	}

	private start() {
		this.server.listen(env.SOCKET_PORT, () => {
			console.log(`WebSocket is running on ws://${env.SERVER_HOST}:${env.SOCKET_PORT}`);
		});

		this.server.on('upgrade', async (r: IncomingMessage, socket: Socket, head: Buffer) => {
			const user = JWT.getUser(Cookies.parse(r.headers.cookie ?? '')[SECURITY.JWT_TOKEN_NAME] ?? '');
			if (!user) {
				socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
				socket.destroy();
				return;
			}

			const userData = await this.userRepository.getUserById(user.username)
			if (!userData) {
				socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
				socket.destroy();
				return;
			}

			r.user = userData;
			this.wss.handleUpgrade(r, socket, head, (ws: WebSocket) => {
				this.wss.emit('connection', ws, r);
			});

		})

		this.wss.on('connection', this.onConnection);
	}

	private onConnection = (connection: WebSocket, r: IncomingMessage) => {
		this.connections.set(r.user.id, connection);
		this.users.set(r.user.id, r.user);

		connection.on('message', (message) => this.onMessage(message, connection, r.user));
		connection.on('close', (code, reason) => this.onClose(code, reason, r.user));
	}

	private onClose(code: number, reason: Buffer, user: I_UserSchema) {
		console.error(`Exiting with number (${code}) for reason`, reason.toString())

		this.connections.delete(user.id);
		this.users.delete(user.id);
	}
}
