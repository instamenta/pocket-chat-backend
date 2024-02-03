import {Router} from 'express';
import {isAuthorized} from "../middlewares";
import MessageController from "../controllers/message";

export default class MessageRouter {

	private readonly router: Router = Router();
	private readonly controller: MessageController;

	constructor(controller: MessageController) {
		this.controller = controller;
		this.initialize(this.controller);
	}

	private initialize(c: MessageController) {
		this.router.post('/', isAuthorized, c.sendMessage.bind(c));
		this.router.put('/:id', isAuthorized, c.updateMessageStatus.bind(c));

		this.router.get('/:friendshipId', c.listMessagesByFriendship.bind(c))
		this.router.get('/:user1/:user2', c.listMessagesByUsers.bind(c))
	}

	public getRouter(): Router {
		return this.router;
	}
}

