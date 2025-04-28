import "dotenv/config";
import { Client } from "pg";
import Redis from "ioredis";
import * as Routers from "./routers";
import { env } from "./utilities/config";
import * as Controllers from "./controllers";
import * as Repositories from "./repositories";
import { Middlewares } from "./middlewares";
import { BCryptHashingHandler } from "./utilities/bcrypt";
import { Notificator } from "./utilities/notificator";
import { initializeAll } from "./utilities/intialize";

void (async function start_service() {
  const { api, database, cache, logger } = await initializeAll();

  graceful_shutdown(database, cache);

  const hashingHandler = new BCryptHashingHandler();

  const repository = {
    user: new Repositories.UserRepository(database, logger, hashingHandler),
    live: new Repositories.LiveRepository(database, logger),
    story: new Repositories.StoryRepository(database, logger),
    short: new Repositories.ShortRepository(database, logger),
    group: new Repositories.GroupRepository(database, logger),
    friend: new Repositories.FriendRepository(database, logger),
    comment: new Repositories.CommentRepository(database, logger),
    message: new Repositories.MessageRepository(database, logger),
    publication: new Repositories.PublicationRepository(database, logger),
    notification: new Repositories.NotificationRepository(database, logger),
  };

  const notificator = new Notificator(
    repository.notification,
    repository.publication,
    repository.comment,
    repository.short,
    repository.story,
  );

  const controller = {
    user: new Controllers.UserController(
      repository.user,
      logger,
      hashingHandler,
    ),
    live: new Controllers.LiveController(repository.live, logger),
    story: new Controllers.StoryController(
      repository.story,
      logger,
      notificator,
    ),
    short: new Controllers.ShortController(
      repository.short,
      logger,
      notificator,
    ),
    group: new Controllers.GroupController(repository.group, logger),
    friend: new Controllers.FriendController(repository.friend, logger),
    message: new Controllers.MessageController(repository.message, logger),
    comment: new Controllers.CommentController(
      repository.comment,
      logger,
      notificator,
    ),
    publication: new Controllers.PublicationController(
      repository.publication,
      logger,
      notificator,
    ),
    notification: new Controllers.NotificationController(
      repository.notification,
      logger,
    ),
  };

  const router = {
    user: new Routers.UserRouter(controller.user).router,
    live: new Routers.LiveRouter(controller.live).router,
    story: new Routers.StoryRouter(controller.story).router,
    short: new Routers.ShortRouter(controller.short).router,
    group: new Routers.GroupRouter(controller.group).router,
    friend: new Routers.FriendRouter(controller.friend).router,
    comment: new Routers.CommentRouter(controller.comment).router,
    message: new Routers.MessageRouter(controller.message).router,
    publication: new Routers.PublicationRouter(controller.publication).router,
    notification: new Routers.NotificationRouter(controller.notification)
      .router,
  };

  api.use("/api/user", router.user);
  api.use("/api/live", router.live);
  api.use("/api/story", router.story);
  api.use("/api/short", router.short);
  api.use("/api/group", router.group);
  api.use("/api/friend", router.friend);
  api.use("/api/comment", router.comment);
  api.use("/api/message", router.message);
  api.use("/api/publication", router.publication);
  api.use("/api/notification", router.notification);

  // @ts-expect-error - to assign handler
  api.use(Middlewares.errorHandler);

  api.listen(+env.SERVER_PORT, env.SERVER_HOST, () => {
    logger.info(
      "App",
      "",
      `Server is running on http://${env.SERVER_HOST}:${env.SERVER_PORT}`,
    );
  });
})();

function graceful_shutdown(database: Client, cache: Redis) {
  ["uncaughtException", "unhandledRejection"].map((type) => {
    process.on(type, (...args) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.error(`process.on ${type} with ${args}`, args);

      database
        .end()
        .then(() => {
          cache.disconnect();
        })
        .catch((error: unknown) => {
          console.error(error);
        })
        .finally(() => {
          process.exit(1);
        });
    });
  });
}
