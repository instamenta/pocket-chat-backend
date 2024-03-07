import {Router} from 'express';
import {isAuthorized} from '../middlewares';
import LiveController from "../controllers/live";

export default class LiveRouter {
	private router: Router = Router();

	constructor(controller: LiveController) {
		this.initializeRoutes(controller);
	}

	private initializeRoutes(c: LiveController) {
		this.router.post('/', isAuthorized, c.createLive.bind(c));
		this.router.get('/', isAuthorized, c.listLives.bind(c));
		this.router.put('/:state', isAuthorized, c.updateLiveState.bind(c));
		this.router.get('/:liveId', isAuthorized, c.listLiveMessages.bind(c));
	}

	public getRouter(): Router {
		return this.router;
	}
}
