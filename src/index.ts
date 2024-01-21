import "dotenv/config";
import {env} from './utilities/config'
import initialize_all from "./utilities/intialize";
import UserRouter from "./routers/user";
import UserController from "./controllers/user";
import UserRepository from "./repositories/user";
import Middlewares from "./middlewares";

void function start_service() {

	const {io, server, api, prisma, redis} = initialize_all();

	const userRepository = new UserRepository(prisma);
	const userController = new UserController(userRepository);
	const userRouter = new UserRouter(userController).getRouter();

	api.use('/api/user', userRouter);
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
