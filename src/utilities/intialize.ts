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

export default async function initialize_all() {
    // initialize_certificates()

    const corsOptions: CORS.CorsOptions = {
        origin: ['http://localhost:3001', 'http://localhost:3000'],
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

    const server = http.createServer();

    const socket = new WebSocketServer({server});

    server.on("error", console.error);

    api.on('error', console.error);

    const database = new Client({connectionString: env.DATABASE_URL});
    await database.connect();

    const cache = new Redis({host: env.REDIS_HOST, port: parseInt(env.REDIS_PORT)});

    return {server, api, database, cache, socket};
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
