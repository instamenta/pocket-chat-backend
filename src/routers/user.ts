import {Router} from 'express';
import UserController from '../controllers/user';
import {isGuest} from "../middlewares";

export default class UserRouter {

	private readonly router: Router = Router();
	private readonly controller: UserController;

	constructor(controller: UserController) {
		this.controller = controller;
		this.initialize(this.controller);
	}

	private initialize(c: UserController) {
		this.router.post('/sign-up', isGuest, c.signUp.bind(c));
		this.router.post('/sign-in', isGuest, c.signIn.bind(c));

		this.router.get('/', c.listUsers.bind(c));
		this.router.get('/auth', c.authUser.bind(c));
		this.router.get('/:id', c.getUserById.bind(c));
		this.router.get('/:username', c.getUserByUsername.bind(c));
	}

	public getRouter(): Router {
		return this.router;
	}
}

