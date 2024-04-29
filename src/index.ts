import "dotenv/config";
import {Client} from "pg";
import Redis from "ioredis";
import Router from './routers';
import {env} from './utilities/config'
import Controller from './controllers';
import Repository from "./repositories";
import Middlewares from "./middlewares";
import BCrypt from './utilities/bcrypt';
import SocketController from "./socket";
import MediaController from "./socket/media";
import Notificator from "./utilities/notificator";
import initialize_all, {initialize_media_server} from "./utilities/intialize";

void async function start_service() {

	const {server, api, database, cache, socket} = await initialize_all();
	await graceful_shutdown(database, cache);

	const hashingHandler = new BCrypt();

	const userRepository = new Repository.User(database, hashingHandler);
	const liveRepository = new Repository.Live(database);
	const storyRepository = new Repository.Story(database);
	const shortRepository = new Repository.Short(database);
	const groupRepository = new Repository.Group(database);
	const friendRepository = new Repository.Friend(database);
	const commentRepository = new Repository.Comment(database);
	const messageRepository = new Repository.Message(database);
	const publicationsRepository = new Repository.Publication(database);
	const notificationRepository = new Repository.Notification(database);

	const notificator = new Notificator(
		notificationRepository,
		publicationsRepository,
		commentRepository,
		shortRepository,
		storyRepository
	);

	const userController = new Controller.User(userRepository, hashingHandler);
	const userRouter = new Router.User(userController).getRouter();

	const liveController = new Controller.Live(liveRepository);
	const liveRouter = new Router.Live(liveController).getRouter();

	const notificationController = new Controller.Notification(notificationRepository);
	const notificationRouter = new Router.Notification(notificationController).getRouter();

	const publicationController = new Controller.Publication(publicationsRepository, notificator);
	const publicationRouter = new Router.Publication(publicationController).getRouter();

	const storyController = new Controller.Story(storyRepository, notificator);
	const storyRouter = new Router.Story(storyController).getRouter();

	const shortController = new Controller.Short(shortRepository, notificator);
	const shortRouter = new Router.Short(shortController).getRouter();

	const groupController = new Controller.Group(groupRepository);
	const groupRouter = new Router.Group(groupController).getRouter();

	const friendController = new Controller.Friend(friendRepository, notificationRepository);
	const friendRouter = new Router.Friend(friendController).getRouter();

	const commentController = new Controller.Comment(commentRepository, notificator);
	const commentRouter = new Router.Comment(commentController).getRouter();

	const messageController = new Controller.Message(messageRepository);
	const messageRouter = new Router.Message(messageController).getRouter();

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
