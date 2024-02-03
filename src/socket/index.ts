import {RawData, WebSocket, WebSocketServer} from "ws";
import {env, SECURITY} from "../utilities/config";
import {IncomingMessage} from "node:http";
import JWT from "../utilities/jwt";
import * as Cookies from 'cookie';
import {message_schema} from "../validators";
import {I_MessageRequest} from "../types/message";
import MessageRepository from "../repositories/message";
import FriendRepository from "../repositories/friend";

export default class SocketController {

	connections: Map<string, WebSocket>;
	users: Map<string, { username: string }>;

	constructor(
		private readonly socket: WebSocketServer,
		private readonly messageRepository: MessageRepository,
		private readonly friendRepository: FriendRepository
	) {
		this.connections = new Map()
		this.users = new Map()
		this.start();
	}

	private start() {
		this.socket.on('connection', this.handleConnection);
	}

	private handleConnection = (connection: WebSocket, request: IncomingMessage) => {
		console.log(`Socket is running on ws://${env.SERVER_HOST}:${env.SERVER_PORT}`)

		const user = JWT.getUser(Cookies.parse(request.headers.cookie ?? '')[SECURITY.JWT_TOKEN_NAME] ?? '');
		if (!user) {
			return connection.close();
		}

		this.connections.set(user.id, connection);
		this.users.set(user.id, {username: user.username});

		connection.on('message', (message) => this.handleMessage(message, user.id, connection));
		connection.on('close', (code, reason) => this.handleClose(code, reason, user.id));
	}

	private async handleMessage(bytes: RawData, id: string, host: WebSocket) {
		try {
			const r: I_MessageRequest = message_schema.parse(JSON.parse(bytes.toString()));

			const friendship = await this.friendRepository.getBySenderAndRecipient(id, r.recipient);
			if (!friendship) {
				return console.error('No friendship found between users', {data: r, sender: id});
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

			const connection = this.connections.get(r.recipient);
			if (!connection) {
				return console.error(`No WebSocket connection for recipient: ${r.recipient}`);
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

			connection.send(response);
			host.send(response);
		} catch (error) {
			console.error(`Error handling message from senderId: ${id}`, error);
		}
	}

	private handleBroadcast() {
		this.connections.forEach((connection, id) => {
			const message = JSON.stringify(this.users.get(id));
			connection.send(message);
		});
	}

	private handleClose(code: number, reason: Buffer, id: string) {
		console.error(`Exiting with number (${code}) for reason`, reason.toString())

		this.connections.delete(id);
		this.users.delete(id);
	}
}
