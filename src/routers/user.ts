import {Router} from 'express';
import UserController from '../controllers/user';
import {isAuthorized, isGuest} from "../middlewares";

export default class UserRouter {

	private readonly router: Router = Router();

	constructor(controller: UserController) {
		this.initialize(controller);
	}

	private initialize(c: UserController) {
		this.router.post('/sign-up', isGuest, c.signUp.bind(c));
		this.router.post('/sign-in', isGuest, c.signIn.bind(c));

		this.router.get('/', c.listUsers.bind(c));
		this.router.get('/auth', isAuthorized,c.authUser.bind(c));
		this.router.get('/:id', c.getUserById.bind(c));
		this.router.get('/username/:username', c.getUserByUsername.bind(c));

		this.router.put('/', isAuthorized, c.updateProfilePublicInformation.bind(c));
		this.router.put('/picture', isAuthorized, c.updateProfilePicture.bind(c));
	}

	public getRouter(): Router {
		return this.router;
	}
}

