import {Middlewares} from '../middlewares';
import {StoryController} from "../controllers/story";
import {BaseRouter} from "../base/router.base";

export class StoryRouter extends BaseRouter<StoryController> {
	initialize(c: StoryController) {
		// @ts-expect-error - to assign handlers
		this.router.get('/', Middlewares.isAuthorized, c.listStories.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.post('/', Middlewares.isAuthorized, c.createStory.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.get('/feed', Middlewares.isAuthorized, c.listFeedStories.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.get('/:username', Middlewares.isAuthorized, c.listFriendStoriesByUsername.bind(c));

		//* Likes
		// @ts-expect-error - to assign handlers
		this.router.put('/:id/like', Middlewares.isAuthorized, c.likeStory.bind(c));

		//* Comments
		// @ts-expect-error - to assign handlers
		this.router.get('/comments/:shortId', Middlewares.isAuthorized, c.listCommentsByStory.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.post('/comments/:shortId', Middlewares.isAuthorized, c.createStoryComment.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.delete('/comments/:commentId', Middlewares.isAuthorized, c.deleteStoryComment.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.put('/comments/:commentId', Middlewares.isAuthorized, c.likeStoryComment.bind(c));
	}
}
