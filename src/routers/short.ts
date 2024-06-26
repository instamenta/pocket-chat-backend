import {isAuthorized} from '../middlewares';
import ShortController from "../controllers/short";
import BaseRouter from "../base/router.base";

export default class ShortRouter extends BaseRouter<ShortController> {
	initialize(c: ShortController) {
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
}
