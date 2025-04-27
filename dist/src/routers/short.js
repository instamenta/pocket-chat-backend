"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const router_base_1 = __importDefault(require("../base/router.base"));
class ShortRouter extends router_base_1.default {
    initialize(c) {
        this.router.post('/', middlewares_1.isAuthorized, c.createShort.bind(c));
        this.router.get('/', middlewares_1.isAuthorized, c.listShorts.bind(c));
        this.router.get('/:id', middlewares_1.isAuthorized, c.listShortsByUsername.bind(c));
        this.router.get('/:shortId/details', c.getShortById.bind(c));
        //* Likes
        this.router.put('/:id/like', middlewares_1.isAuthorized, c.likeShort.bind(c));
        //* Comments
        this.router.get('/comments/details', c.getCommentById.bind(c));
        this.router.get('/comments/:shortId', middlewares_1.isAuthorized, c.listCommentsByShort.bind(c));
        this.router.post('/comments/:shortId', middlewares_1.isAuthorized, c.createShortComment.bind(c));
        this.router.delete('/comments/:commentId', middlewares_1.isAuthorized, c.deleteShortComment.bind(c));
        this.router.put('/comments/:commentId', middlewares_1.isAuthorized, c.likeShortComment.bind(c));
    }
}
exports.default = ShortRouter;
