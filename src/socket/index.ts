import {RawData, WebSocket, WebSocketServer} from "ws";
import {env, SECURITY} from "../utilities/config";
import {IncomingMessage} from "node:http";
import JWT from "../utilities/jwt";
import * as Cookies from 'cookie';

export default class SocketController {

	connections: Map<string, WebSocket>;
	users: Map<string, { username: string }>;

	constructor(private readonly socket: WebSocketServer) {
		this.connections = new Map()
		this.users = new Map()
		this.start();
	}

	start() {
		this.socket.on('connection', this.handleConnection);
	}

	handleConnection = (connection: WebSocket, request: IncomingMessage) => {
		console.log(`Socket is running on ws://${env.SERVER_HOST}:${env.SERVER_PORT}`)

		const user = JWT.getUser(
			Cookies.parse(request.headers.cookie ?? '')[SECURITY.JWT_TOKEN_NAME] ?? ''
		);

		if (!user) return connection.close();

		this.connections.set(user.id, connection);

		this.users.set(user.id, {
			username: user.username,
		});

		connection.on('close', (code, reason) => this.handleClose(code, reason, id))
		connection.on('message', (message) => this.handleMessage(message, id))
	}

	handleMessage(bytes: RawData, id: string) {
		const message: { username: string; state: object; } = JSON.parse(bytes.toString());
		this.users.set(id, message);
		this.handleBroadcast();
		console.log(message);
	}

	handleBroadcast() {
		Object.keys(this.connections).forEach((id) => {
			const connection = this.connections.get(id);
			if (!connection) return;

			const message = JSON.stringify(this.users);

			connection.send(message);
		})
	}

	handleClose(code: number, reason: Buffer, id: string) {
		console.error(`Exiting with number (${code}) for reason`, reason.toString())

		this.connections.delete(id);
		this.connections.delete(id);
	}
}
