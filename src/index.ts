import "dotenv/config";
import {env} from './utilities/config'
import initialize_all from "./utilities/intialize";
import UserRouter from "./routers/user";
import UserController from "./controllers/user";
import UserRepository from "./repositories/user";
import Middlewares from "./middlewares";
import {Client} from "pg";
import Redis from "ioredis";
import FriendRepository from "./repositories/friend";
import FriendController from "./controllers/friend";
import FriendRouter from "./routers/friend";

void async function start_service() {

	const {io, server, api, database, cache} = await initialize_all();
	await graceful_shutdown(database, cache);

	const userRepository = new UserRepository(database);
	const userController = new UserController(userRepository);
	const userRouter = new UserRouter(userController).getRouter();

	const friendRepository = new FriendRepository(database);
	const friendController = new FriendController(friendRepository);
	const friendRouter = new FriendRouter(friendController).getRouter();

	api.use('/api/user', userRouter);
	api.use('/api/friend', friendRouter);
	api.use(Middlewares.errorHandler);

	io.on("connection", (socket) => {
		console.log("Socket connected:", socket.id);
	});

	server.listen(
		parseInt(env.SERVER_PORT),
		env.SERVER_HOST,
		(): void =>
			console.log(`Server is running on http://${env.SERVER_HOST}:${env.SERVER_PORT}`));
}();

async function graceful_shutdown(database: Client, cache: Redis) {
	['uncaughtException', 'unhandledRejection'].map(type => {
		process.on(type, async (...args) => {
			try {
				console.error(`process.on ${type} with ${args}`, args);
				await database.end();
				await cache.disconnect();
			} catch (error: Error | unknown) {
				console.error(error)
			} finally {
				process.exit(1)
			}
		});
	});
}
