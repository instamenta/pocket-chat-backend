import UserController from '../controllers/user';
import {isAuthorized, isGuest} from "../middlewares";
import RouterBase from "../base/router.base";

export default class UserRouter extends RouterBase<UserController> {
	initializeRoutes(c: UserController) {
		this.router.post('/sign-up', isGuest, c.signUp.bind(c));
		this.router.post('/sign-in', isGuest, c.signIn.bind(c));

		this.router.get('/', c.listUsers.bind(c));
		this.router.get('/auth', isAuthorized, c.authUser.bind(c));
		this.router.get('/:id', c.getUserById.bind(c));
		this.router.get('/username/:username', c.getUserByUsername.bind(c));

		this.router.put('/', isAuthorized, c.updateProfilePublicInformation.bind(c));
		this.router.put('/picture', isAuthorized, c.updateProfilePicture.bind(c));
		this.router.put('/bio', isAuthorized, c.updateBio.bind(c))
	}
}

