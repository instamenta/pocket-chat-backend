import Redis from "ioredis";
import {RawData, WebSocket, WebSocketServer} from "ws";
import {Server} from "node:http";
import {env, SECURITY} from "../utilities/config";
import JWT from "../utilities/jwt";
import * as Cookies from "cookie";
import UserRepository from "../repositories/user";
import {NotImplementedError} from "@instamenta/vanilla-utility-pack";
import * as T from '../types'
import VLogger, {IVlog} from "@instamenta/vlogger";

export default class BaseSocket {

	protected readonly log: IVlog
	protected connections: Map<string, WebSocket>;
	protected liveRoomsConnections: Map<string, Array<{ connection: WebSocket, userId: string }>>;

	constructor(
		protected readonly wss: WebSocketServer,
		protected readonly server: Server,
		protected readonly cache: Redis,
		logger: VLogger,
		protected readonly userRepository: UserRepository,
	) {
		this.connections = new Map();
		this.liveRoomsConnections = new Map();
		this.log = logger.getVlogger(this.constructor.name);
		this.start();
	}

	protected onClose(code: number, reason: Buffer, user: T.User.Schema) {
		this.log.error({e: '', m: `Exiting with number (${code}) for reason ${reason.toString()}.`})
		this.connections.delete(user.id);
		this.cache.del(`user=${user.id}`);
	}

	protected start() {
		this.server.listen(env.SOCKET_PORT, () => {
			this.log.info({m: `WebSocket is running on ws://${env.SERVER_HOST}:${env.SOCKET_PORT}`});
		});
		this.wss.on('connection', this.onConnection);
	}

	protected onConnection = async (ws: WebSocket, r: any) => {
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
		ws.on('error', (e) => this.log.error({e, m: 'Websocket ran into Error'}));
	}

	protected async onData(bytes: RawData, host: WebSocket, user: T.User.Schema,) {
		throw new NotImplementedError(`Implement ${this.constructor.name}.onData()`)
	}
}