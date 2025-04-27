import "dotenv/config";
import {Client} from "pg";
import Redis from "ioredis";
import * as Routers from './routers';
import {env} from './utilities/config'
import * as Controllers from './controllers';
import * as Repositories from "./repositories";
import {Middlewares} from "./middlewares";
import {BCryptHashingHandler} from './utilities/bcrypt';
import {Notificator} from "./utilities/notificator";
import {initialize_all} from "./utilities/intialize";

void async function start_service() {
	const {api, database, cache, logger} = await initialize_all();

	graceful_shutdown(database, cache);

	const hashingHandler = new BCryptHashingHandler();

	const repository = {
		user: new Repositories.User(database, logger, hashingHandler),
		live: new Repositories.Live(database, logger),
		story: new Repositories.Story(database, logger),
		short: new Repositories.Short(database, logger),
		group: new Repositories.Group(database, logger),
		friend: new Repositories.Friend(database, logger),
		comment: new Repositories.Comment(database, logger),
		message: new Repositories.Message(database, logger),
		publications: new Repositories.Publication(database, logger),
		notification: new Repositories.Notification(database, logger),
	};

	const notificator = new Notificator(
		repository.notification,
		repository.publications,
		repository.comment,
		repository.short,
		repository.story
	);

	const controller = {
		user: new Controllers.User(repository.user, logger, hashingHandler),
		live: new Controllers.Live(repository.live, logger),
		story: new Controllers.Story(repository.story, logger, notificator),
		short: new Controllers.Short(repository.short, logger, notificator),
		group: new Controllers.Group(repository.group, logger),
		friend: new Controllers.Friend(repository.friend, logger),
		message: new Controllers.Message(repository.message, logger),
		comment: new Controllers.Comment(repository.comment, logger, notificator),
		publication: new Controllers.Publication(repository.publications, logger, notificator),
		notification: new Controllers.Notification(repository.notification, logger),
	};

	const router = {
		user: new Routers.User(controller.user).router,
		live: new Routers.Live(controller.live).router,
		story: new Routers.Story(controller.story).router,
		short: new Routers.Short(controller.short).router,
		group: new Routers.Group(controller.group).router,
		friend: new Routers.Friend(controller.friend).router,
		comment: new Routers.Comment(controller.comment).router,
		message: new Routers.Message(controller.message).router,
		publication: new Routers.Publication(controller.publication).router,
		notification: new Routers.Notification(controller.notification).router,
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
