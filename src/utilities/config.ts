import "dotenv/config";
import z from "zod";

const env = z.object({
	FOLDER: z.string(),
	CERTIFICATE_AGE: z.string(),
	CERTIFICATE_NAME: z.string(),
	SERVER_KEY_PATH: z.string(),
	SERVER_CERT_PATH: z.string(),
	CLIENT_CERT_PATH: z.string(),
	SERVER_HOST: z.string(),
	SERVER_PORT: z.string(),
	SERVER_BACKLOG: z.string(),
	DATABASE_URL: z.string(),
	REDIS_HOST: z.string(),
	REDIS_PORT: z.string(),
	SALT_ROUNDS: z.string(),
	JWT_SECRET: z.string(),
	JWT_TOKEN_NAME: z.string(),
	JWT_EXPIRATION_TIME: z.string(),
	SOCKET_PORT: z.string(),
	PEER_PORT: z.string(),
	MEDIA_SOCKET_PORT: z.string(),
}).parse(process.env);

const SECURITY = {
	FOLDER: env.FOLDER,
	AGE: env.CERTIFICATE_AGE,
	NAME: env.CERTIFICATE_NAME,
	SERVER_KEY_PATH: env.SERVER_KEY_PATH,
	SERVER_CERT_PATH: env.SERVER_CERT_PATH,
	CLIENT_CERT_PATH: env.CLIENT_CERT_PATH,
	SALT_ROUNDS: parseInt(env.SALT_ROUNDS),
	JWT_SECRET: env.JWT_SECRET,
	JWT_TOKEN_NAME: env.JWT_TOKEN_NAME,
	JWT_EXPIRATION_TIME: env.JWT_EXPIRATION_TIME
};

export {env, SECURITY}