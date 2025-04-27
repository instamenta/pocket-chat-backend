"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const router_base_1 = __importDefault(require("../base/router.base"));
class PublicationRouter extends router_base_1.default {
    initialize(c) {
        // @ts-expect-error - to assign handlers
        this.router.get('/', middlewares_1.Middlewares.isAuthorized, c.listPublications.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/recommendations', middlewares_1.Middlewares.isAuthorized, c.getRecommendations.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/:id', middlewares_1.Middlewares.isAuthorized, c.getPublicationById.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/user/:id', c.getPublicationsByUserId.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/user/:id/count', c.getPublicationsCountByUserId.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.post('/', middlewares_1.Middlewares.isAuthorized, c.createPublication.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/:id', middlewares_1.Middlewares.isAuthorized, c.updatePublication.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/:id/like', middlewares_1.Middlewares.isAuthorized, c.likePublication.bind(c));
    }
}
exports.default = PublicationRouter;
