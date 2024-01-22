import {Router} from 'express';
import UserController from '../controllers/user';
import {isAuthorized, isGuest} from "../middlewares";

export default class UserRouter {

	private readonly router: Router = Router();
	private readonly controller: UserController;

	constructor(controller: UserController) {
		this.controller = controller;
		this.initialize(this.controller);
	}

	private initialize(c: UserController) {
		this.router.post('/sign-up', isGuest, c.createUser.bind(c));
		this.router.post('/sign-in', isGuest, c.loginUser.bind(c));

		this.router.post('/friend/{id}', isAuthorized, c.sendFriendRequest.bind(c));
	}

	public getRouter(): Router {
		return this.router;
	}
}

