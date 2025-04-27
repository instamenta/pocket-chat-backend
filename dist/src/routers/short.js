"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const router_base_1 = __importDefault(require("../base/router.base"));
class ShortRouter extends router_base_1.default {
    initialize(c) {
        // @ts-expect-error - to assign handlers
        this.router.post('/', middlewares_1.Middlewares.isAuthorized, c.createShort.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/', middlewares_1.Middlewares.isAuthorized, c.listShorts.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/:id', middlewares_1.Middlewares.isAuthorized, c.listShortsByUsername.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/:shortId/details', c.getShortById.bind(c));
        //* Likes
        // @ts-expect-error - to assign handlers
        this.router.put('/:id/like', middlewares_1.Middlewares.isAuthorized, c.likeShort.bind(c));
        //* Comments
        // @ts-expect-error - to assign handlers
        this.router.get('/comments/details', c.getCommentById.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.get('/comments/:shortId', middlewares_1.Middlewares.isAuthorized, c.listCommentsByShort.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.post('/comments/:shortId', middlewares_1.Middlewares.isAuthorized, c.createShortComment.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.delete('/comments/:commentId', middlewares_1.Middlewares.isAuthorized, c.deleteShortComment.bind(c));
        // @ts-expect-error - to assign handlers
        this.router.put('/comments/:commentId', middlewares_1.Middlewares.isAuthorized, c.likeShortComment.bind(c));
    }
}
exports.default = ShortRouter;
