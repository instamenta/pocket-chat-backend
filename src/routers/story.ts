import {Router} from 'express';
import {isAuthorized} from '../middlewares';
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

		//* Likes
		this.router.put('/:id/like', isAuthorized, c.likeStory.bind(c));

		//* Comments
		this.router.get('/comment/:shortId', isAuthorized, c.listCommentsByStory.bind(c));
		this.router.post('/comment/:shortId', isAuthorized, c.createStoryComment.bind(c));
		this.router.delete('/comment/:commentId', isAuthorized, c.deleteStoryComment.bind(c));
		this.router.put('/comment/:commentId', isAuthorized, c.likeStoryComment.bind(c));

	}

	public getRouter(): Router {
		return this.router;
	}
}
