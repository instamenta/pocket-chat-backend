import PublicationController from '../controllers/publication';
import {Middlewares} from '../middlewares';
import BaseRouter from "../base/router.base";

export default class PublicationRouter extends BaseRouter<PublicationController> {
	initialize(c: PublicationController) {
		// @ts-expect-error - to assign handlers
		this.router.get('/', Middlewares.isAuthorized, c.listPublications.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.get('/recommendations', Middlewares.isAuthorized, c.getRecommendations.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.get('/:id', Middlewares.isAuthorized, c.getPublicationById.bind(c));
		this.router.get('/user/:id', c.getPublicationsByUserId.bind(c));
		this.router.get('/user/:id/count', c.getPublicationsCountByUserId.bind(c));

		// @ts-expect-error - to assign handlers
		this.router.post('/', Middlewares.isAuthorized, c.createPublication.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.put('/:id', Middlewares.isAuthorized, c.updatePublication.bind(c));
		// @ts-expect-error - to assign handlers
		this.router.put('/:id/like', Middlewares.isAuthorized, c.likePublication.bind(c));
	}
}
