import {env, SECURITY} from "./config";
import {Client} from "pg";
import Redis from "ioredis";
import express from "express";
import BODY_PARSER from 'body-parser';
import CORS from 'cors';
import MORGAN from 'morgan';
import COOKIE_PARSER from 'cookie-parser';
import VLogger from '@instamenta/vlogger'

const corsOptions: CORS.CorsOptions = {
	origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3004', 'http://localhost:5173', 'http://192.168.1.8:3001'],
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true,
	optionsSuccessStatus: 204,
	allowedHeaders: ['Content-Type', SECURITY.JWT_TOKEN_NAME],
}

export default async function initialize_all() {
	const logger = VLogger.getInstance();

	const log = logger.getVlogger('App');

	const api = express();

	api.use(CORS(corsOptions));
	api.use(COOKIE_PARSER());
	api.use(BODY_PARSER.json());
	api.use(MORGAN('dev'))
	api.use(BODY_PARSER.urlencoded({extended: true}));

	api.on('error', (e) => { log.error({e, m: 'Express server error'}); });

	const database = new Client({connectionString: env.DATABASE_URL});
	await database.connect();

	const cache = new Redis({host: env.REDIS_HOST, port: parseInt(env.REDIS_PORT)});

	return {api, database, cache, logger};
}
