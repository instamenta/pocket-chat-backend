import CommentController from '../controllers/comment';
import {isAuthorized} from '../middlewares';
import RouterBase from "../base/router.base";

export default class CommentRouter extends RouterBase<CommentController> {
	initializeRoutes(c: CommentController) {
		this.router.get('/:publicationId', isAuthorized, c.listByPublication.bind(c));
		this.router.get('/:commentId/details', c.getCommentById.bind(c));
		this.router.post('/:publicationId', isAuthorized, c.create.bind(c));
		this.router.delete('/:commentId', isAuthorized, c.delete.bind(c));
		this.router.put('/:commentId', isAuthorized, c.like.bind(c));
	}
}
