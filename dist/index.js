"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const Routers = __importStar(require("./routers"));
const config_1 = require("./utilities/config");
const Controllers = __importStar(require("./controllers"));
const Repositories = __importStar(require("./repositories"));
const middlewares_1 = require("./middlewares");
const bcrypt_1 = require("./utilities/bcrypt");
const notificator_1 = require("./utilities/notificator");
const intialize_1 = require("./utilities/intialize");
void async function main() {
    const { api, database, cache, logger } = await (0, intialize_1.initializeAll)();
    gracefulShutdown(database, cache);
    const hashingHandler = new bcrypt_1.BCryptHashingHandler(logger);
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
    const notificator = new notificator_1.Notificator(repository.notification, repository.publication, repository.comment, repository.short, repository.story, logger);
    const controller = {
        user: new Controllers.UserController(repository.user, logger, hashingHandler),
        live: new Controllers.LiveController(repository.live, logger),
        story: new Controllers.StoryController(repository.story, logger, notificator),
        short: new Controllers.ShortController(repository.short, logger, notificator),
        group: new Controllers.GroupController(repository.group, logger),
        friend: new Controllers.FriendController(repository.friend, logger),
        message: new Controllers.MessageController(repository.message, logger),
        comment: new Controllers.CommentController(repository.comment, logger, notificator),
        publication: new Controllers.PublicationController(repository.publication, logger, notificator),
        notification: new Controllers.NotificationController(repository.notification, logger),
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
    api.use(middlewares_1.Middlewares.errorHandler);
    api.listen(+config_1.env.SERVER_PORT, config_1.env.SERVER_HOST, () => {
        logger.info("App", "", `Server is running on http://${config_1.env.SERVER_HOST}:${config_1.env.SERVER_PORT}`);
    });
}();
function gracefulShutdown(database, cache) {
    ["uncaughtException", "unhandledRejection"].map((type) => {
        process.on(type, (...args) => {
            console.error(`process.on ${type} with ${args}`, args);
            database
                .end()
                .then(() => {
                cache.disconnect();
            })
                .catch((error) => {
                console.error(error);
            })
                .finally(() => {
                process.exit(1);
            });
        });
    });
}
