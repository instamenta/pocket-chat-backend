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
import SocketController from "./socket";
import MessageRepository from "./repositories/message";
import MessageController from "./controllers/message";
import MessageRouter from "./routers/message";
import NotificationRepository from "./repositories/notification";
import NotificationController from "./controllers/notification";
import NotificationRouter from "./routers/notification";
import PublicationRepository from "./repositories/publication";
import PublicationController from "./controllers/publication";
import PublicationRouter from "./routers/publication";
import CommentController from "./controllers/comment";
import CommentRepository from "./repositories/comment";
import CommentRouter from "./routers/comment";

void async function start_service() {

	const {server, api, database, cache, socket} = await initialize_all();
	await graceful_shutdown(database, cache);

	const userRepository = new UserRepository(database);
	const userController = new UserController(userRepository);
	const userRouter = new UserRouter(userController).getRouter();

	const friendRepository = new FriendRepository(database);
	const friendController = new FriendController(friendRepository);
	const friendRouter = new FriendRouter(friendController).getRouter();

	const commentRepository = new CommentRepository(database);
	const commentController = new CommentController(commentRepository);
	const commentRouter = new CommentRouter(commentController).getRouter();

	const messageRepository = new MessageRepository(database);
	const messageController = new MessageController(messageRepository);
	const messageRouter = new MessageRouter(messageController).getRouter();

	const publicationsRepository = new PublicationRepository(database);
	const publicationController = new PublicationController(publicationsRepository);
	const publicationRouter = new PublicationRouter(publicationController).getRouter();

	const notificationRepository = new NotificationRepository(database);
	const notificationController = new NotificationController(notificationRepository);
	const notificationRouter = new NotificationRouter(notificationController).getRouter();

	api.use('/api/user', userRouter);
	api.use('/api/friend', friendRouter);
	api.use('/api/comment', commentRouter);
	api.use('/api/message', messageRouter);
	api.use('/api/publication', publicationRouter);
	api.use('/api/notification', notificationRouter);
	api.use(Middlewares.errorHandler);

	api.listen(+env.SERVER_PORT, env.SERVER_HOST, () =>
		console.log(`Server is running on http://${env.SERVER_HOST}:${env.SERVER_PORT}`)
	);

	new SocketController(
		socket,
		server,
		cache,
		userRepository,
		friendRepository,
		messageRepository,
		notificationRepository,
	);
}();

async function graceful_shutdown(database: Client, cache: Redis) {
	['uncaughtException', 'unhandledRejection'].map(type => {
		process.on(type, async (...args) => {
			try {
				console.error(`process.on ${type} with ${args}`, args);
				await database.end();
				cache.disconnect();
			} catch (error: Error | unknown) {
				console.error(error);
			} finally {
				process.exit(1);
			}
		});
	});
}
