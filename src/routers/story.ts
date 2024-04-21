import {isAuthorized} from '../middlewares';
import StoryController from "../controllers/story";
import RouterBase from "../base/router.base";

export default class StoryRouter extends RouterBase<StoryController> {
	initializeRoutes(c: StoryController) {
		this.router.get('/', isAuthorized, c.listStories.bind(c));
		this.router.post('/', isAuthorized, c.createStory.bind(c));
		this.router.get('/feed', isAuthorized, c.listFeedStories.bind(c));
		this.router.get('/:username', isAuthorized, c.listFriendStoriesByUsername.bind(c));

		//* Likes
		this.router.put('/:id/like', isAuthorized, c.likeStory.bind(c));

		//* Comments
		this.router.get('/comments/:shortId', isAuthorized, c.listCommentsByStory.bind(c));
		this.router.post('/comments/:shortId', isAuthorized, c.createStoryComment.bind(c));
		this.router.delete('/comments/:commentId', isAuthorized, c.deleteStoryComment.bind(c));
		this.router.put('/comments/:commentId', isAuthorized, c.likeStoryComment.bind(c));
	}
}
