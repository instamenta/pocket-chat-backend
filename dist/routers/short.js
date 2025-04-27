"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortRouter = void 0;
const middlewares_1 = require("../middlewares");
const router_base_1 = require("../base/router.base");
class ShortRouter extends router_base_1.BaseRouter {
    initialize(c) {
        this.router.post('/', middlewares_1.Middlewares.isAuthorized, c.createShort.bind(c));
        this.router.get('/', middlewares_1.Middlewares.isAuthorized, c.listShorts.bind(c));
        this.router.get('/:id', middlewares_1.Middlewares.isAuthorized, c.listShortsByUsername.bind(c));
        this.router.get('/:shortId/details', c.getShortById.bind(c));
        this.router.put('/:id/like', middlewares_1.Middlewares.isAuthorized, c.likeShort.bind(c));
        this.router.get('/comments/details', c.getCommentById.bind(c));
        this.router.get('/comments/:shortId', middlewares_1.Middlewares.isAuthorized, c.listCommentsByShort.bind(c));
        this.router.post('/comments/:shortId', middlewares_1.Middlewares.isAuthorized, c.createShortComment.bind(c));
        this.router.delete('/comments/:commentId', middlewares_1.Middlewares.isAuthorized, c.deleteShortComment.bind(c));
        this.router.put('/comments/:commentId', middlewares_1.Middlewares.isAuthorized, c.likeShortComment.bind(c));
    }
}
exports.ShortRouter = ShortRouter;
