import {Router} from 'express';
import UserController from '../controllers/user';

export default class UserRouter {

	private readonly router: Router = Router();
	private readonly controller: UserController;

	constructor(controller: UserController) {
		this.controller = controller;
		this.initialize(this.controller);
	}

	private initialize(c: UserController) {
		this.router.post('/sign-up', c.createUser.bind(c));
		this.router.post('/sign-in', c.loginUser.bind(c));
	}

	public getRouter(): Router {
		return this.router;
	}
}

