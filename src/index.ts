import "dotenv/config";
import {Client} from "pg";
import Redis from "ioredis";
import Router from './routers';
import {env} from './utilities/config'
import Controller from './controllers';
import Repository from "./repositories";
import {Middlewares} from "./middlewares";
import BCrypt from './utilities/bcrypt';
import Notificator from "./utilities/notificator";
import initialize_all from "./utilities/intialize";

void async function start_service() {
	const {api, database, cache, logger} = await initialize_all();

	graceful_shutdown(database, cache);

	const hashingHandler = new BCrypt();

	const repository = {
		user: new Repository.User(database, logger, hashingHandler),
		live: new Repository.Live(database, logger),
		story: new Repository.Story(database, logger),
		short: new Repository.Short(database, logger),
		group: new Repository.Group(database, logger),
		friend: new Repository.Friend(database, logger),
		comment: new Repository.Comment(database, logger),
		message: new Repository.Message(database, logger),
		publications: new Repository.Publication(database, logger),
		notification: new Repository.Notification(database, logger),
	};

	const notificator = new Notificator(
		repository.notification,
		repository.publications,
		repository.comment,
		repository.short,
		repository.story
	);

	const controller = {
		user: new Controller.User(repository.user, logger, hashingHandler),
		live: new Controller.Live(repository.live, logger),
		story: new Controller.Story(repository.story, logger, notificator),
		short: new Controller.Short(repository.short, logger, notificator),
		group: new Controller.Group(repository.group, logger),
		friend: new Controller.Friend(repository.friend, logger),
		message: new Controller.Message(repository.message, logger),
		comment: new Controller.Comment(repository.comment, logger, notificator),
		publication: new Controller.Publication(repository.publications, logger, notificator),
		notification: new Controller.Notification(repository.notification, logger),
	};

	const router = {
		user: new Router.User(controller.user).router,
		live: new Router.Live(controller.live).router,
		story: new Router.Story(controller.story).router,
		short: new Router.Short(controller.short).router,
		group: new Router.Group(controller.group).router,
		friend: new Router.Friend(controller.friend).router,
		comment: new Router.Comment(controller.comment).router,
		message: new Router.Message(controller.message).router,
		publication: new Router.Publication(controller.publication).router,
		notification: new Router.Notification(controller.notification).router,
	};

	api.use('/api/user', router.user);
	api.use('/api/live', router.live);
	api.use('/api/story', router.story);
	api.use('/api/short', router.short);
	api.use('/api/group', router.group);
	api.use('/api/friend', router.friend);
	api.use('/api/comment', router.comment);
	api.use('/api/message', router.message);
	api.use('/api/publication', router.publication);
	api.use('/api/notification', router.notification);

	// @ts-expect-error - to assign handler
	api.use(Middlewares.errorHandler);

	api.listen(+env.SERVER_PORT, env.SERVER_HOST, () => {
		logger.info('App', '', `Server is running on http://${env.SERVER_HOST}:${env.SERVER_PORT}`)
	});
}();

function graceful_shutdown(database: Client, cache: Redis) {
	['uncaughtException', 'unhandledRejection'].map((type) => {
		process.on(type, (...args) => {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			console.error(`process.on ${type} with ${args}`, args);

			database.end().then(() => {
				cache.disconnect();
			}).catch((error: unknown) => {
				console.error(error);
			}).finally(() => {
				process.exit(1);
			});
		});
	});
}
