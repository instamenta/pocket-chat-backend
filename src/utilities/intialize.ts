import {env, SECURITY} from "./config";
import {PrismaClient} from "@prisma/client";
import Redis from "ioredis";
import http from "node:http";
import express from "express";
import {Server} from "socket.io";
import BODY_PARSER from 'body-parser';
import CORS from 'cors';
import MORGAN from 'morgan';
import COOKIE_PARSER from 'cookie-parser';


export default function initialize_all() {
	// initialize_certificates()

	const corsOptions: CORS.CorsOptions = {
		origin: 'http://localhost:3001',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
		optionsSuccessStatus: 204,
		allowedHeaders: ['Content-Type', SECURITY.JWT_TOKEN_NAME],
	}

	const api = express();
	api.use(CORS(corsOptions));
	api.use(COOKIE_PARSER());
	api.use(BODY_PARSER.json());
	api.use(MORGAN('dev'))
	api.use(BODY_PARSER.urlencoded({extended: true}));

	const server = http.createServer(api);

	const io = new Server(server, {});

	io.engine.on("connection_error", console.error);
	server.on("error", console.error);
	api.on('error', console.error);

	const prisma = new PrismaClient()
	const redis = new Redis({
		host: env.REDIS_HOST || 'localhost',
		port: parseInt(env.REDIS_PORT || '6379', 10),
	});

	return {io, server, api, prisma, redis}
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
