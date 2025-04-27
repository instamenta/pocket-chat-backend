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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const routers_1 = __importDefault(require("./routers"));
const config_1 = require("./utilities/config");
const controllers_1 = __importDefault(require("./controllers"));
const repositories_1 = __importDefault(require("./repositories"));
const middlewares_1 = __importDefault(require("./middlewares"));
const bcrypt_1 = __importDefault(require("./utilities/bcrypt"));
const socket_1 = __importDefault(require("./socket"));
const media_1 = __importDefault(require("./socket/media"));
const notificator_1 = __importDefault(require("./utilities/notificator"));
const intialize_1 = __importStar(require("./utilities/intialize"));
void async function start_service() {
    const { server, api, database, cache, socket, logger } = await (0, intialize_1.default)();
    graceful_shutdown(database, cache);
    const hashingHandler = new bcrypt_1.default();
    const repository = {
        user: new repositories_1.default.User(database, logger, hashingHandler),
        live: new repositories_1.default.Live(database, logger),
        story: new repositories_1.default.Story(database, logger),
        short: new repositories_1.default.Short(database, logger),
        group: new repositories_1.default.Group(database, logger),
        friend: new repositories_1.default.Friend(database, logger),
        comment: new repositories_1.default.Comment(database, logger),
        message: new repositories_1.default.Message(database, logger),
        publications: new repositories_1.default.Publication(database, logger),
        notification: new repositories_1.default.Notification(database, logger),
    };
    const notificator = new notificator_1.default(repository.notification, repository.publications, repository.comment, repository.short, repository.story);
    const controller = {
        user: new controllers_1.default.User(repository.user, logger, hashingHandler),
        live: new controllers_1.default.Live(repository.live, logger),
        story: new controllers_1.default.Story(repository.story, logger, notificator),
        short: new controllers_1.default.Short(repository.short, logger, notificator),
        group: new controllers_1.default.Group(repository.group, logger),
        friend: new controllers_1.default.Friend(repository.friend, logger, repository.notification),
        message: new controllers_1.default.Message(repository.message, logger),
        comment: new controllers_1.default.Comment(repository.comment, logger, notificator),
        publication: new controllers_1.default.Publication(repository.publications, logger, notificator),
        notification: new controllers_1.default.Notification(repository.notification, logger),
    };
    const router = {
        user: new routers_1.default.User(controller.user).getRouter(),
        live: new routers_1.default.Live(controller.live).getRouter(),
        story: new routers_1.default.Story(controller.story).getRouter(),
        short: new routers_1.default.Short(controller.short).getRouter(),
        group: new routers_1.default.Group(controller.group).getRouter(),
        friend: new routers_1.default.Friend(controller.friend).getRouter(),
        comment: new routers_1.default.Comment(controller.comment).getRouter(),
        message: new routers_1.default.Message(controller.message).getRouter(),
        publication: new routers_1.default.Publication(controller.publication).getRouter(),
        notification: new routers_1.default.Notification(controller.notification).getRouter(),
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
    api.use(middlewares_1.default.errorHandler);
    api.listen(+config_1.env.SERVER_PORT, config_1.env.SERVER_HOST, () => {
        logger.info('App', '', `Server is running on http://${config_1.env.SERVER_HOST}:${config_1.env.SERVER_PORT}`);
    });
    //* WS Module
    new socket_1.default(socket, server, cache, logger, repository.user, repository.live, repository.friend, repository.message, notificator);
    //* Socket IO Module
    const { io } = (0, intialize_1.initialize_media_server)();
    new media_1.default(io);
}();
function graceful_shutdown(database, cache) {
    ['uncaughtException', 'unhandledRejection'].map((type) => {
        process.on(type, async (...args) => {
            try {
                console.error(`process.on ${type} with ${args}`, args);
                await database.end();
                cache.disconnect();
            }
            catch (error) {
                console.error(error);
            }
            finally {
                process.exit(1);
            }
        });
    });
}
