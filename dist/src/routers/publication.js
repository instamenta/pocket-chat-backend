"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const router_base_1 = __importDefault(require("../base/router.base"));
class PublicationRouter extends router_base_1.default {
    initialize(c) {
        this.router.get('/', middlewares_1.isAuthorized, c.listPublications.bind(c));
        this.router.get('/recommendations', middlewares_1.isAuthorized, c.getRecommendations.bind(c));
        this.router.get('/:id', middlewares_1.isAuthorized, c.getPublicationById.bind(c));
        this.router.get('/user/:id', c.getPublicationsByUserId.bind(c));
        this.router.get('/user/:id/count', c.getPublicationsCountByUserId.bind(c));
        this.router.post('/', middlewares_1.isAuthorized, c.createPublication.bind(c));
        this.router.put('/:id', middlewares_1.isAuthorized, c.updatePublication.bind(c));
        this.router.put('/:id/like', middlewares_1.isAuthorized, c.likePublication.bind(c));
    }
}
exports.default = PublicationRouter;
