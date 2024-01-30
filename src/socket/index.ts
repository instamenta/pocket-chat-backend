import {RawData, WebSocket, WebSocketServer} from "ws";
import {env} from "../utilities/config";
import url from "node:url";
import {v4 as uuid} from "uuid";
import {IncomingMessage} from "node:http";
import JWT from "../utilities/jwt";

export default class SocketController {

	connections: Map<string, WebSocket>;
	users: Map<string, { username: string, state: object }>;

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

		// @ts-ignore
		const {query: {username}} = url.parse(request.url, true)

		const user = JWT.getUser(request.headers.cookie ?? '');


		if (!username) return console.log('No username')

		const id = uuid();

		console.log(username);

		this.connections.set(id, connection);

		this.users.set(id, {
			username: username.toString(),
			state: {x: 0, y: 0,}
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
