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
		this.router.get('/list', c.listUsers.bind(c));
		// @ts-ignore
		this.router.post('/sign-up', isGuest, c.createUser.bind(c));
		this.router.post('/sign-in', isGuest, c.loginUser.bind(c));

		this.router.get('/friends/', isAuthorized, c.listFriendRequests.bind(c));
		this.router.post('/friends/:id', isAuthorized, c.sendFriendRequest.bind(c));
		this.router.delete('/friends/:id', isAuthorized, c.deleteFriendRequest.bind(c))
	}

	public getRouter(): Router {
		return this.router;
	}
}

