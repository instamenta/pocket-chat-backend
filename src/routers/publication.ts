import PublicationController from '../controllers/publication';
import {isAuthorized} from '../middlewares';
import BaseRouter from "../base/router.base";

export default class PublicationRouter extends BaseRouter<PublicationController> {
	initialize(c: PublicationController) {
		this.router.get('/', isAuthorized, c.listPublications.bind(c));
		this.router.get('/recommendations', isAuthorized, c.getRecommendations.bind(c));
		this.router.get('/:id', isAuthorized, c.getPublicationById.bind(c));
		this.router.get('/user/:id', c.getPublicationsByUserId.bind(c));
		this.router.get('/user/:id/count', c.getPublicationsCountByUserId.bind(c));

		this.router.post('/', isAuthorized, c.createPublication.bind(c));
		this.router.put('/:id', isAuthorized, c.updatePublication.bind(c));
		this.router.put('/:id/like', isAuthorized, c.likePublication.bind(c));
	}
}
