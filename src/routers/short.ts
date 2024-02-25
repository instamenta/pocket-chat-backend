import {Router} from 'express';
import {isAuthorized} from '../middlewares';
import ShortController from "../controllers/short";

export default class ShortRouter {
	private router: Router = Router();

	constructor(controller: ShortController) {
		this.initializeRoutes(controller);
	}

	private initializeRoutes(c: ShortController) {
		this.router.post('/', isAuthorized, c.createShort.bind(c));
		this.router.get('/', isAuthorized, c.listShorts.bind(c));
		this.router.get('/:id', isAuthorized, c.listShortsByUsername.bind(c));
	}

	public getRouter(): Router {
		return this.router;
	}
}
