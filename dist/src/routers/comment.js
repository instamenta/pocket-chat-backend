"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../middlewares");
const router_base_1 = __importDefault(require("../base/router.base"));
class CommentRouter extends router_base_1.default {
    initialize(c) {
        this.router.get('/:publicationId', middlewares_1.isAuthorized, c.listByPublication.bind(c));
        this.router.get('/:commentId/details', c.getCommentById.bind(c));
        this.router.post('/:publicationId', middlewares_1.isAuthorized, c.create.bind(c));
        this.router.delete('/:commentId', middlewares_1.isAuthorized, c.delete.bind(c));
        this.router.put('/:commentId', middlewares_1.isAuthorized, c.like.bind(c));
    }
}
exports.default = CommentRouter;
