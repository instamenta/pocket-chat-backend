import {env, SECURITY} from "./config";
import {Client} from "pg";
import Redis from "ioredis";
import http from "node:http";
import express from "express";
import BODY_PARSER from 'body-parser';
import CORS from 'cors';
import MORGAN from 'morgan';
import COOKIE_PARSER from 'cookie-parser';
import {WebSocketServer} from 'ws';
import {ExpressPeerServer} from "peer";
import {Server as SocketIoServer} from 'socket.io'
import VLogger from '@instamenta/vlogger'

const corsOptions: CORS.CorsOptions = {
	origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3004', 'http://localhost:5173', 'http://192.168.1.8:3001'],
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true,
	optionsSuccessStatus: 204,
	allowedHeaders: ['Content-Type', SECURITY.JWT_TOKEN_NAME],
}

export default async function initialize_all() {
	// initialize_certificates()
	const logger = VLogger.getInstance();

	const log = logger.getVlogger('App');

	const api = express();

	const peer_server = http.createServer(api);

	const peer = ExpressPeerServer(peer_server, {path: '/'})

	api.use('/peerjs', peer);

	peer_server.listen(env.PEER_PORT, () => {
		log.info({m: `Peer is running on http://${env.SERVER_HOST}:${env.PEER_PORT}/peerjs`});
	});

	api.use(CORS(corsOptions));
	api.use(COOKIE_PARSER());
	api.use(BODY_PARSER.json());
	api.use(MORGAN('dev'))
	api.use(BODY_PARSER.urlencoded({extended: true}));

	const server = http.createServer();

	const socket = new WebSocketServer({server});

	server.on("error", (e) => log.error({e, m: 'Websocket server Error'}));

	api.on('error', (e) => log.error({e, m: 'Express server error'}));

	const database = new Client({connectionString: env.DATABASE_URL});
	await database.connect();

	const cache = new Redis({host: env.REDIS_HOST, port: parseInt(env.REDIS_PORT)});

	return {server, api, database, cache, socket, logger};
}

export function initialize_media_server() {
	const logger = VLogger.getInstance();

	const log = logger.getVlogger('App');

	const app = express();
	const server = http.createServer(app);
	const io = new SocketIoServer(
		server,
		{cors: corsOptions}
	);

	server.listen(env.MEDIA_SOCKET_PORT, () => {
		log.info({m: `Server listening on http://localhost:${env.MEDIA_SOCKET_PORT}`});
	});

	return {io};
}

// function initialize_certificates(): void {
// 	if (!fs.existsSync(SECURITY.FOLDER)) fs.mkdirSync(SECURITY.FOLDER);
// 	if (!fs.existsSync(SECURITY.SERVER_KEY_PATH)
// 		|| !fs.existsSync(SECURITY.SERVER_CERT_PATH)
// 		|| !fs.existsSync(SECURITY.SERVER_CERT_PATH)
// 	) {
// 		const generated_result = Certificate.generate(
// 			[{name: SECURITY.NAME, value: env.SERVER_HOST}],
// 			{days: parseInt(SECURITY.AGE)}
// 		);
// 		fs.writeFileSync(SECURITY.SERVER_KEY_PATH, generated_result.private);
// 		fs.writeFileSync(SECURITY.SERVER_CERT_PATH, generated_result.cert);
// 		fs.writeFileSync(SECURITY.CLIENT_CERT_PATH, generated_result.public);
// 	}
// }
