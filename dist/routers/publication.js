"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationRouter = void 0;
const middlewares_1 = require("../middlewares");
const router_base_1 = require("../base/router.base");
class PublicationRouter extends router_base_1.BaseRouter {
    initialize(c) {
        this.router.get('/', middlewares_1.Middlewares.isAuthorized, c.listPublications.bind(c));
        this.router.get('/recommendations', middlewares_1.Middlewares.isAuthorized, c.getRecommendations.bind(c));
        this.router.get('/:id', middlewares_1.Middlewares.isAuthorized, c.getPublicationById.bind(c));
        this.router.get('/user/:id', c.getPublicationsByUserId.bind(c));
        this.router.get('/user/:id/count', c.getPublicationsCountByUserId.bind(c));
        this.router.post('/', middlewares_1.Middlewares.isAuthorized, c.createPublication.bind(c));
        this.router.put('/:id', middlewares_1.Middlewares.isAuthorized, c.updatePublication.bind(c));
        this.router.put('/:id/like', middlewares_1.Middlewares.isAuthorized, c.likePublication.bind(c));
    }
}
exports.PublicationRouter = PublicationRouter;
