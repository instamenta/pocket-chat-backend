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

void async function start_service() {

    const {server, api, database, cache, socket} = await initialize_all();
    await graceful_shutdown(database, cache);

    const userRepository = new UserRepository(database);
    const userController = new UserController(userRepository);
    const userRouter = new UserRouter(userController).getRouter();

    const friendRepository = new FriendRepository(database);
    const friendController = new FriendController(friendRepository);
    const friendRouter = new FriendRouter(friendController).getRouter();

		const messageRepository = new MessageRepository(database);
		const messageController = new MessageController(messageRepository);
		const messageRouter = new MessageRouter(messageController).getRouter();

    api.use('/api/user', userRouter);
    api.use('/api/friend', friendRouter);
		api.use('/api/message', messageRouter);
    api.use(Middlewares.errorHandler);

    api.listen(
        parseInt(env.SERVER_PORT),
        env.SERVER_HOST,
        (): void =>
            console.log(`Server is running on http://${env.SERVER_HOST}:${env.SERVER_PORT}`));

    server.listen(env.SOCKET_PORT, () => {
        console.log(`WebSocket is running on ws://${env.SERVER_HOST}:${env.SOCKET_PORT}`);
    })

    new SocketController(socket, messageRepository, friendRepository);
}();

async function graceful_shutdown(database: Client, cache: Redis) {
    ['uncaughtException', 'unhandledRejection'].map(type => {
        process.on(type, async (...args) => {
            try {
                console.error(`process.on ${type} with ${args}`, args);
                await database.end();
                cache.disconnect();
            } catch (error: Error | unknown) {
                console.error(error)
            } finally {
                process.exit(1)
            }
        });
    });
}
