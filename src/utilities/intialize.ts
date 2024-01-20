import fs from "fs";
import Certificate from "selfsigned";
import {env, SECURITY} from "./config";
import {PrismaClient} from "@prisma/client";
import Redis from "ioredis";
import https from "node:https";
import express from "express";
import {Server} from "socket.io";
import bodyParser from 'body-parser';

export default function initialize_all() {
	initialize_certificates()

	const api = express();
	api.use(require('cors')());
	api.use(bodyParser.json());

	const server = https.createServer({
		key: fs.readFileSync(SECURITY.SERVER_KEY_PATH),
		cert: fs.readFileSync(SECURITY.SERVER_CERT_PATH),
	}, api);

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


function initialize_certificates(): void {
	if (!fs.existsSync(SECURITY.FOLDER)) fs.mkdirSync(SECURITY.FOLDER);
	if (!fs.existsSync(SECURITY.SERVER_KEY_PATH)
		|| !fs.existsSync(SECURITY.SERVER_CERT_PATH)
		|| !fs.existsSync(SECURITY.SERVER_CERT_PATH)
	) {
		const generated_result = Certificate.generate(
			[{name: SECURITY.NAME, value: env.SERVER_HOST}],
			{days: parseInt(SECURITY.AGE)}
		);
		fs.writeFileSync(SECURITY.SERVER_KEY_PATH, generated_result.private);
		fs.writeFileSync(SECURITY.SERVER_CERT_PATH, generated_result.cert);
		fs.writeFileSync(SECURITY.CLIENT_CERT_PATH, generated_result.public);
	}
}
