import { Router } from 'express';
import CommentController from '../controllers/comment';
import { isAuthorized } from '../middlewares';

export default class CommentRouter {
	private router: Router = Router();

	constructor(controller: CommentController) {
		this.initializeRoutes(controller);
	}

	private initializeRoutes(c: CommentController) {
		this.router.get('/:publicationId', isAuthorized, c.listByPublication.bind(c));
		this.router.post('/:publicationId', isAuthorized, c.create.bind(c));
		this.router.delete('/:commentId', isAuthorized, c.delete.bind(c));
		this.router.put('/:commentId', isAuthorized, c.like.bind(c));
	}

	public getRouter(): Router {
		return this.router;
	}
}
