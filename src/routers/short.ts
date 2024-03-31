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
		this.router.get('/:shortId/details', c.getShortById.bind(c));

		//* Likes
		this.router.put('/:id/like', isAuthorized, c.likeShort.bind(c));

		//* Comments
		this.router.get('/comments/details', c.getCommentById.bind(c));
		this.router.get('/comments/:shortId', isAuthorized, c.listCommentsByShort.bind(c));
		this.router.post('/comments/:shortId', isAuthorized, c.createShortComment.bind(c));
		this.router.delete('/comments/:commentId', isAuthorized, c.deleteShortComment.bind(c));
		this.router.put('/comments/:commentId', isAuthorized, c.likeShortComment.bind(c));

	}

	public getRouter(): Router {
		return this.router;
	}
}
