import "dotenv/config";
import {env} from './utilities/config'
import initialize_all, {initialize_media_server} from "./utilities/intialize";
import UserRouter from "./routers/user";
import Middlewares from "./middlewares";
import {Client} from "pg";
import Redis from "ioredis";
import Notificator from "./utilities/notificator";
import SocketController from "./socket";
import MediaController from "./socket/media";
import controllers from './controllers'
import repositories from "./repositories";
import routers from './routers';
import Logger from '@instamenta/vlogger'

void async function start_service() {

	const {server, api, database, cache, socket} = await initialize_all();
	await graceful_shutdown(database, cache);
	const logger = Logger.getInstance();

	const userRepository = new repositories.User(database, logger);
	const liveRepository = new repositories.Live(database, logger);
	const storyRepository = new repositories.Story(database, logger);
	const shortRepository = new repositories.Short(database, logger);
	const groupRepository = new repositories.Group(database, logger);
	const friendRepository = new repositories.Friend(database, logger);
	const commentRepository = new repositories.Comment(database, logger);
	const messageRepository = new repositories.Message(database, logger);
	const publicationsRepository = new repositories.Publication(database, logger);
	const notificationRepository = new repositories.Notification(database, logger);

	const notificator = new Notificator(
		notificationRepository,
		publicationsRepository,
		commentRepository,
		shortRepository,
		storyRepository
	);

	const userController = new controllers.User(userRepository);
	const userRouter = new UserRouter(userController).getRouter();

	const liveController = new controllers.Live(liveRepository);
	const liveRouter = new routers.Live(liveController).getRouter();

	const notificationController = new controllers.Notification(notificationRepository);
	const notificationRouter = new routers.Notification(notificationController).getRouter();

	const publicationController = new controllers.Publication(publicationsRepository, notificator);
	const publicationRouter = new routers.Publication(publicationController).getRouter();

	const storyController = new controllers.Story(storyRepository, notificator);
	const storyRouter = new routers.Story(storyController).getRouter();

	const shortController = new controllers.Short(shortRepository, notificator);
	const shortRouter = new routers.Short(shortController).getRouter();

	const groupController = new controllers.Group(groupRepository);
	const groupRouter = new routers.Group(groupController).getRouter();

	const friendController = new controllers.Friend(friendRepository);
	const friendRouter = new routers.Friend(friendController).getRouter();

	const commentController = new controllers.Comment(commentRepository, notificator);
	const commentRouter = new routers.Comment(commentController).getRouter();

	const messageController = new controllers.Message(messageRepository);
	const messageRouter = new routers.Message(messageController).getRouter();

	api.use('/api/user', userRouter);
	api.use('/api/live', liveRouter);
	api.use('/api/story', storyRouter);
	api.use('/api/short', shortRouter);
	api.use('/api/group', groupRouter);
	api.use('/api/friend', friendRouter);
	api.use('/api/comment', commentRouter);
	api.use('/api/message', messageRouter);
	api.use('/api/publication', publicationRouter);
	api.use('/api/notification', notificationRouter);
	api.use(Middlewares.errorHandler);

	api.listen(+env.SERVER_PORT, env.SERVER_HOST, () =>
		console.log(`Server is running on http://${env.SERVER_HOST}:${env.SERVER_PORT}`)
	);

	//* Websocket Handlers

	//* WS Module
	new SocketController(
		socket,
		server,
		cache,
		userRepository,
		liveRepository,
		friendRepository,
		messageRepository,
		notificator,
	);

	//* Socket IO Module
	const {io} = initialize_media_server();

	new MediaController(io);
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
