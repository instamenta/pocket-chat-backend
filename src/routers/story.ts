import { Router } from 'express';
import { isAuthorized } from '../middlewares';
import StoryController from "../controllers/story";

export default class StoryRouter {
	private router: Router = Router();

	constructor(controller: StoryController) {
		this.initializeRoutes(controller);
	}

	private initializeRoutes(c: StoryController) {
		this.router.get('/', isAuthorized, c.listStories.bind(c));
		this.router.post('/', isAuthorized, c.createStory.bind(c));
		this.router.get('/feed', isAuthorized, c.listFeedStories.bind(c));
		this.router.get('/:username', isAuthorized, c.listFriendStoriesByUsername.bind(c));
	}

	public getRouter(): Router {
		return this.router;
	}
}
